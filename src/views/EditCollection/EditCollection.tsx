import supabaseBowrserClient from "@src/utils/supabase-browser";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Database } from "@lib/database.types";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { kebabCase } from "lodash";
import { StemList } from "@src/components";
type Collection = Database["public"]["Tables"]["collections"]["Row"];

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
  const [thumbnail, setThumbnail] =
    useState<Collection["thumbnail_url"]>(null);
  const [banner, setBanner] = useState<Collection["banner_url"]>(null);
  const [draft, setDraft] = useState<Collection["draft"]>();

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

                  <ThumbnailUpload
                    uid={collection?.id}
                    url={thumbnail}
                    size={128}
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

                  <BannerUpload
                    uid={collection?.id}
                    url={banner}
                    size={128}
                    onUpload={(url) => {
                      setBanner(url);
                      updateCollection({
                        name,
                        description,
                        banner_url: url,
                        thumbnail_url: thumbnail,
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

      <div className="mt-10 sm:mt-0">
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
              <StemList collectionId={collection.id} />
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
    </div>
  );
}

interface ThumbnailUploadProps {
  uid?: Collection["id"];
  url: Collection["thumbnail_url"];
  size: number;
  onUpload: (url: string) => void;
}

interface BannerUploadProps {
  uid?: Collection["id"];
  url: Collection["banner_url"];
  size: number;
  onUpload: (url: string) => void;
}

function BannerUpload({ uid, url, size, onUpload }: BannerUploadProps) {
  const { data: session } = useSession();
  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [banner, setBanner] = useState<Collection["banner_url"]>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("banners")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setBanner(url);
    } catch (error) {
      toast.error("Error downloading image");
    }
  }

  const uploadBanner: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log(fileName, filePath);

      let { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      toast.error("Error uploading banner");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Cover photo
      </label>
      <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
        <div className="space-y-1 text-center">
          {banner ? (
            <Image
              src={banner}
              alt="Avatar"
              className="h-full w-full text-gray-300"
              fill
            />
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={uploadBanner}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}

function ThumbnailUpload({ uid, url, size, onUpload }: ThumbnailUploadProps) {
  const { data: session } = useSession();
  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [thumbnail, setThumbnail] =
    useState<Collection["thumbnail_url"]>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("thumbnails")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setThumbnail(url);
    } catch (error) {
      toast.error("Error downloading image");
    }
  }

  const uploadThumbnail: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log(fileName, filePath);

      let { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      toast.error("Error uploading image");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Thumbnail
      </label>
      <div className="mt-2 flex items-center">
        <span className="inline-block h-32 w-32 overflow-hidden rounded-md bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Avatar"
              className="h-full w-full text-gray-300"
              width={size}
              height={size}
            />
          ) : (
            <svg
              className="h-full w-full text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </span>
        <label
          htmlFor="single"
          className="ml-5 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          {uploading ? "Uploading ..." : "Change"}
        </label>
        <input
          className="hidden absolute"
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadThumbnail}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
