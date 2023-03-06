import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Database } from "@lib/database.types";
import supabaseBowrserClient from "@src/utils/supabase-browser";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { ipfsClient, resolveIPFS } from "@src/utils/resolveIPFS";
import IPFSUpload from "../IPFSUpload";
type Collection = Database["public"]["Tables"]["collections"]["Row"];
type Stem = Database["public"]["Tables"]["stems"]["Row"];

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  collectionId: Collection["id"];
  stemID?: Stem["id"];
}

export default function StemModal({
  open,
  setOpen,
  collectionId,
  stemID,
}: ModalProps) {
  const { data: session } = useSession();

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [loading, setLoading] = useState(false);

  const [tokenId, setTokenId] = useState<Stem["token_id"]>(null);
  const [name, setName] = useState<Stem["name"]>(null);
  const [description, setDescription] = useState<Stem["description"]>(null);
  const [imageHash, setImageHash] = useState<Stem["image_hash"]>(null);
  const [audioHash, setAudioHash] = useState<Stem["audio_hash"]>(null);
  const [supply, setSupply] = useState<Stem["supply"]>(null);
  const [price, setPrice] = useState<Stem["price"]>(null);

  const [instrument, setInstrument] = useState<Stem["instrument"]>(null);
  const [bpm, setBpm] = useState<Stem["bpm"]>(null);
  const [key, setKey] = useState<Stem["key"]>(null);
  const [genre, setGenre] = useState<Stem["genre"]>(null);
  const [license, setLicense] = useState<Stem["license"]>(null);


  useEffect(() => {
    if (stemID) getStem();
  }, [stemID]);

  async function getStem() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("stems")
        .select(`*`)
        .eq("id", stemID)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        //setCollection(data);
        setTokenId(data.token_id);
        setName(data.name);
        setDescription(data.description);
        setImageHash(data.image_hash);
        setAudioHash(data.audio_hash);
        setSupply(data.supply);
        setPrice(data.price);
        setInstrument(data.instrument)
        setBpm(data.bpm)
        setKey(data.key)
        setGenre(data.genre)
        setLicense(data.license)
      }
    } catch (error) {
      toast.error("Error Loading Stem");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteStem() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      const { error } = await supabase.from("stems").delete().eq("id", stemID);
      if (error) throw error;
      toast.success("Stem Deleted!");
    } catch (error) {
      console.log(error);
      toast.error("Some error occured deleting!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  async function createStem() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      if (!name) {
        toast.error("At least give us a name!");
        return;
      }

      const updates = {
        id: stemID,
        token_id: tokenId,
        collection_id: collectionId,
        name,
        description,
        image_hash: imageHash,
        audio_hash: audioHash,
        supply,
        price,
        instrument,
        bpm,
        key,
        genre,
        license
      };

      let { error, data } = await supabase
        .from("stems")
        .upsert(updates)
        .select();
      console.log(data);
      if (error) throw error;

      // alert("Collection created!");
      toast.success("Stem saved!");
    } catch (error) {
      console.log(error);
      toast.error("Some error occured!");
    } finally {
      setLoading(false);
      setOpen(false);
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
                        STEM Metadata
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Fill out the information.
                        </p>
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                      <div className="sm:col-span-4 lg:col-span-5">
                        <IPFSUpload
                          label={"Cover Art"}
                          name="cover"
                          fileType="image/*"
                          ipfsUrl={imageHash}
                          onUpload={(url) => {
                            setImageHash(url);
                          }}
                        />

                        <IPFSUpload
                          label={"Audio"}
                          name="audio-file"
                          fileType="audio/*"
                          ipfsUrl={audioHash}
                          onUpload={(url) => {
                            setAudioHash(url);
                          }}
                        />

                        {/* <div className="overflow-hidden rounded-lg mt-6">
                          <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Cover Art
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
                                    htmlFor="cover-art"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="cover-art"
                                      name="cover-art"
                                      accept="image/*"
                                      type="file"
                                      className="sr-only"
                                      onChange={uploadCoverArt}
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
                          {imageHash && (
                            <div>
                              <img src={resolveIPFS(imageHash)} width="600px" />
                              <a href={resolveIPFS(imageHash)} target="_blank">
                                {resolveIPFS(imageHash)}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="overflow-hidden rounded-lg mt-6">
                          <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Audio
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
                                    htmlFor="audio-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="audio-upload"
                                      name="audio-upload"
                                      accept="audio/*"
                                      type="file"
                                      className="sr-only"
                                      onChange={uploadAudio}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  MP3, WAV up to 50MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <div className="sm:col-span-8 lg:col-span-7">
                        <section
                          aria-labelledby="options-heading"
                          className="mt-6"
                        >
                          <div className="mt-5 md:col-span-2 md:mt-0">
                            <div className="overflow-hidden shadow sm:rounded-md">
                              <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                  <div className="col-span-6 sm:col-span-3">
                                    <label
                                      htmlFor="id"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Token ID
                                    </label>
                                    <input
                                      type="number"
                                      name="id"
                                      id="id"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={tokenId || ""}
                                      onChange={(e) =>
                                        setTokenId(parseInt(e.target.value))
                                      }
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3">
                                    <label
                                      htmlFor="name"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      id="name"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={name || ""}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>

                                  <div className="col-span-6 ">
                                    <label
                                      htmlFor="description"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Description
                                    </label>
                                    <textarea
                                      id="description"
                                      name="description"
                                      rows={3}
                                      className="mt-1 p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                      placeholder="A brief description of your STEM audio."
                                      defaultValue={""}
                                      value={description || ""}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3">
                                    <label
                                      htmlFor="price"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Price
                                    </label>
                                    <input
                                      type="number"
                                      name="price"
                                      id="price"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={price || ""}
                                      onChange={(e) =>
                                        setPrice(parseFloat(e.target.value))
                                      }
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3">
                                    <label
                                      htmlFor="supply"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Supply
                                    </label>
                                    <input
                                      type="number"
                                      name="supply"
                                      id="supply"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={supply || ""}
                                      onChange={(e) =>
                                        setSupply(parseInt(e.target.value))
                                      }
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label
                                      htmlFor="instrument"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Instrument
                                    </label>
                                    <input
                                      type="text"
                                      name="instrument"
                                      id="instrument"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={instrument || ""}
                                      onChange={(e) => setInstrument(e.target.value)}
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label
                                      htmlFor="bpm"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      BPM
                                    </label>
                                    <input
                                      type="text"
                                      name="bpm"
                                      id="bpm"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={bpm || ""}
                                      onChange={(e) => setBpm(parseInt(e.target.value))}
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label
                                      htmlFor="key"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Key
                                    </label>
                                    <input
                                      type="text"
                                      name="key"
                                      id="pkey"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={key || ""}
                                      onChange={(e) => setKey(e.target.value)}
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label
                                      htmlFor="genre"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Genre
                                    </label>
                                    <input
                                      type="text"
                                      name="genre"
                                      id="genre"
                                      className="px-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={genre || ""}
                                      onChange={(e) => setGenre(e.target.value)}
                                    />
                                  </div>

                                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label
                                      htmlFor="license"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      License
                                    </label>
                                    <select
                                      id="license"
                                      name="license"
                                      className="px-2 mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      value={license || ""}
                                      onChange={(e) => setLicense(e.target.value)}
                                    >
                                      <option>Open Source</option>
                                      <option>Paid</option>
                                    </select>
                                  </div>

                                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label
                                      htmlFor="license"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Royalty
                                    </label>
                                    <select
                                      id="license"
                                      name="license"
                                      className="px-2 mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                      <option>0%</option>
                                      <option>5%</option>
                                      <option>10%</option>
                                      <option>15%</option>
                                      <option>20%</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                {stemID && (
                                  <button
                                    type="submit"
                                    className="mr-4 inline-flex justify-center rounded-md bg-red-400 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    onClick={() => deleteStem()}
                                    disabled={loading}
                                  >
                                    Delete
                                  </button>
                                )}

                                <button
                                  type="submit"
                                  className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                  onClick={() => createStem()}
                                  disabled={loading}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
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
