import {
  CheckCircleIcon,
  ChevronRightIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import StemModal from "../StemModal";

import { Database } from "@lib/database.types";
import supabaseBowrserClient from "@src/utils/supabase-browser";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { resolveIPFS } from "@src/utils/resolveIPFS";
import Image from "next/image";
type Collection = Database["public"]["Tables"]["collections"]["Row"];
type Stem = Database["public"]["Tables"]["stems"]["Row"];

interface StemListProps {
  collectionId: Collection["id"];
}

export default function StemList({ collectionId }: StemListProps) {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stemId, setStemId] = useState<Stem["id"]>();
  const [stems, setStems] = useState<Stem[]>();
  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  useEffect(() => {
    getStems();
  }, [collectionId, open]);

  async function getStems() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("stems")
        .select(`*`)
        .eq("collection_id", collectionId)
        .order("token_id", { ascending: true });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setStems(data);
      }
    } catch (error) {
      toast.error("Error loading stems!");
      console.log(error);
    } finally {
      setLoading(false);
      
    }
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {stems?.map((stem) => (
          <li key={stem.id}>
            <div className="block hover:bg-gray-50">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-12 w-12 rounded-lg"
                      src={stem.image_hash ? resolveIPFS(stem.image_hash)! : ""}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <button
                        className="truncate text-sm font-medium text-indigo-600 hover:underline"
                        onClick={() => {
                          setStemId(stem.id);
                          setOpen(true);
                        }}
                      >
                        {`ID: ${stem.token_id} - ${stem.name}`}
                      </button>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="line-clamp-2">{stem.description}</span>
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div>
                        <button
                          className="text-sm text-gray-900 flex hover:text-indigo-500"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("play", stem.name);
                          }}
                        >
                          <PlayIcon
                            className="h-5 w-5 mr-2 text-indigo-500"
                            aria-hidden="true"
                          />{" "}
                          Play
                        </button>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          {`Supply: ${stem.supply} - Price: ${stem.price}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
        <li key="cta">
          <div className="m-1">
            <button
              onClick={() => {
                setStemId(undefined);
                setOpen(true);
              }}
              className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              {loading ? "Loading..." : "Add Stem"}
            </button>
          </div>
        </li>
      </ul>

      {open && stemId && (
        <StemModal
          open={open}
          setOpen={setOpen}
          collectionId={collectionId}
          stemID={stemId}
        />
      )}

      {open && !stemId && (
        <StemModal open={open} setOpen={setOpen} collectionId={collectionId} />
      )}
    </div>
  );
}
