import { classNames } from "@src/helpers";
import { CreateModal } from "@src/components";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import supabaseBowrserClient from "@src/utils/supabase-browser";

import { Database } from "@lib/database.types";
import Link from "next/link";
type Collections = Database["public"]["Tables"]["collections"]["Row"];



export default function CollectionList() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collections[]>();

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  useEffect(() => {
    getCollections();
  }, [session, open]);

  async function getCollections() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("collections")
        .select(`*`)
        .eq("owner_address", session.user.address);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCollections(data);
      }
      
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            My STEM Collections
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the STEM collections in your account including their
            name, description, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collections?.map((collection) => (
              <tr key={collection.id}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                  {collection.name}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Description</dt>
                    <dd className="mt-1 truncate text-gray-700">
                      {collection.description}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {collection.description}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <span
                    className={classNames(
                      collection.draft
                        ? "text-yellow-800 bg-yellow-200"
                        : "text-green-800 bg-green-100",
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    )}
                  >
                    {collection.draft ? "draft" : "publised"}
                  </span>
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <Link href={`/collection/${collection.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {collection.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateModal open={open} setOpen={setOpen} />
    </div>
  );
}
