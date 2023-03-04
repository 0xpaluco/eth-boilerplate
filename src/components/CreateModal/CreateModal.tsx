import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Database } from "@lib/database.types";
import { useSession } from "next-auth/react";
import supabaseBowrserClient from "@src/utils/supabase-browser";
import { useRouter } from "next/router";

import { kebabCase } from "lodash";

import toast from "react-hot-toast";

type Collections = Database["public"]["Tables"]["collections"]["Row"];

interface CreateModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateModal({ open, setOpen }: CreateModalProps) {
  const router = useRouter();

  const { data: session } = useSession();

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<Collections["name"]>("");
  const [slug, setSlug] = useState<Collections["slug"]>("");
  const [description, setDescription] =
    useState<Collections["description"]>("");
  const [thumbnail, setThumbnail] = useState<Collections["thumbnail"]>(null);

  async function createCollection({
    name,
    description,
    thumbnail,
  }: {
    name: Collections["name"];
    description: Collections["description"];
    thumbnail: Collections["thumbnail"];
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      if(name.length == 0){
        toast.error("At least give us a name!");
        return
      }

      const updates = {
        user_id: session.user_id,
        owner_address: session.user.address,
        slug: kebabCase(name),
        name,
        description,
        thumbnail,
      };

      let { error, data } = await supabase.from("collections").upsert(updates);
      console.log(data);
      if (error) throw error;

      // alert("Collection created!");
      toast.success("Collection created!");
      setOpen(false);
      router.push("/collections");
    } catch (error) {
      console.log(error);
      toast.error("Some error occured!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <form action="#" method="POST" className="w-full">
                    <div className="mt-3 text-center sm:mt-0  sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Create a Collection
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Some basic information to get us started.
                        </p>
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                      <div className="sm:col-span-4 lg:col-span-5">
                        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg mt-6">
                          <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Thumbnail
                            </label>
                            <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                              <div className="space-y-5 text-center">
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
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-8 lg:col-span-7">
                        <section
                          aria-labelledby="options-heading"
                          className="mt-6"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Collection options
                          </h3>

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
                              required
                              className="px-2 block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="Really Cool Sounds"
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="mt-6">
                            <label
                              htmlFor="about"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Description
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="p-2 mt-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                placeholder="A brief description for your collection."
                                defaultValue={""}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mt-6">
                            <button
                              type="submit"
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                              onClick={() =>
                                createCollection({
                                  name,
                                  description,
                                  thumbnail,
                                })
                              }
                              disabled={loading}
                            >
                              {loading ? "Loading ..." : "Create"}
                            </button>
                          </div>
                        </section>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}