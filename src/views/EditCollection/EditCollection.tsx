import supabaseBowrserClient from "@src/utils/supabase-browser";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Database } from "@lib/database.types";
import { toast } from "react-hot-toast";
import { kebabCase } from "lodash";
import { IPFSUpload, StemList } from "@src/components";
type Collection = Database["public"]["Tables"]["collections"]["Row"];
type Stem = Database["public"]["Tables"]["stems"]["Row"];

interface EditCollectionViewProps {
  collectionId?: string | string[];
}

export default function EditCollectionView({
  collectionId,
}: EditCollectionViewProps) {
  const { data: session } = useSession();

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Collection>();
  const [name, setName] = useState<Collection["name"]>("");
  const [description, setDescription] =
    useState<Collection["description"]>(null);
  const [thumbnail, setThumbnail] = useState<Collection["thumbnail_url"]>(null);
  const [banner, setBanner] = useState<Collection["banner_url"]>(null);
  const [draft, setDraft] = useState<Collection["draft"]>();

  const [stems, setStems] = useState<Stem[]>();
  useEffect(() => {
    getCollection();
    console.log(collectionId);
    console.log(session?.user_id);
  }, [collectionId]);

  async function getCollection() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("collections")
        .select(`*`)
        .eq("id", collectionId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCollection(data);
        setName(data.name);
        setDescription(data.description);
        setThumbnail(data.thumbnail_url);
        setBanner(data.banner_url);
      }
    } catch (error) {
      toast.error("Error Loading Collection");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCollection({
    name,
    description,
    thumbnail_url,
    banner_url,
  }: {
    name: Collection["name"];
    description: Collection["description"];
    thumbnail_url: Collection["thumbnail_url"];
    banner_url: Collection["banner_url"];
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      if (!name) {
        toast.error("At least give us a name!");
        return;
      }

      const updates = {
        id: collection?.id!,
        user_id: session.user_id,
        name,
        slug: kebabCase(name),
        owner_address: session.user.address,
        description,
        thumbnail_url,
        banner_url,
        updated_at: new Date().toISOString(),
        draft,
      };

      let { error } = await supabase.from("collections").upsert(updates);
      if (error) throw error;
      toast.success("Collection Updated!");
    } catch (error) {
      console.log(error);
      toast.error("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  const [metadata, setMetadata] = useState<any[]>();
  
  async function generateMetadata(_collection: Collection, _stems: Stem[]) {
    const abi: any[] = new Array<any>()
    const meta = { path: "metadata.json", content: { name: _collection.name, description: _collection.description, image: _collection.thumbnail_url } }
    abi.push(meta)

    console.log(_stems.length);
    
    for (let i = 0; i < _stems.length; i++) {
      const stem = _stems[i];
      let stemMeta = {
        path: `${stem.token_id}.json`,
        content: {
          id: stem.token_id,
          name: stem.name,
          description: stem.description,
          image: stem.image_hash,
          animation_url: stem.audio_hash,
          attributes: [
            {
              "trait_type": "Instrument",
              "value": stem.instrument
            },
            {
              "trait_type": "BPM",
              "value": stem.bpm
            },
            {
              "trait_type": "Key",
              "value": stem.key
            },
            {
              "trait_type": "Genre",
              "value": stem.genre
            },
            {
              "trait_type": "License",
              "value": stem.license
            }
          ]
        }
      }
      abi.push(stemMeta)
    }
    setMetadata(abi)
  }

  return (
    <div className="sm:m-8 m-4">
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Stem Collection
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className=" px-2 block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder={"Really Cool Sounds"}
                          value={name ?? ""}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="mt-1 p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                        placeholder="A brief description of your collection."
                        value={description || ""}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your collection.
                    </p>
                  </div>

                  <IPFSUpload
                    label={"Thumbnail"}
                    name="thumbnail"
                    fileType="image/*"
                    ipfsUrl={thumbnail}
                    onUpload={(url) => {
                      setThumbnail(url);
                      updateCollection({
                        name,
                        description,
                        thumbnail_url: url,
                        banner_url: banner,
                      });
                    }}
                  />

                  <IPFSUpload
                    label={"Banner"}
                    name="banner"
                    fileType="image/*"
                    ipfsUrl={banner}
                    onUpload={(url) => {
                      setBanner(url);
                      updateCollection({
                        name,
                        description,
                        thumbnail_url: thumbnail,
                        banner_url: url,
                      });
                    }}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    disabled={loading}
                    onClick={() =>
                      updateCollection({
                        name,
                        description,
                        banner_url: banner,
                        thumbnail_url: thumbnail,
                      })
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0 mb-10">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                STEM Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                All the STEMs Metadata.
              </p>
            </div>
          </div>

          {collection && (
            <div className="mt-5 md:col-span-2 md:mt-0">
              <StemList collectionId={collection.id} onLoad={(stems) => {
                setStems(stems)
              }}/>
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200 mb-4" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0 mb-10">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Contract Deployment
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Generate Metadata and deploy contract.
              </p>
            </div>
          </div>

          {collection && (
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Generate and Deploy
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Generate Metadata and Deploy the STEM Collection Contract.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-00 shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      onClick={()=> {
                        generateMetadata(collection, stems!)
                        console.log(metadata);
                        
                      }}
                    >
                      Generate
                    </button>
                      {metadata && (
                        <button
                      type="button"
                      className="mx-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Deploy
                    </button>
                      )}
                    
                  </div>
                </div>
              </div>

             
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
