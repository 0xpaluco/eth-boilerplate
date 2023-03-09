import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { Database } from "@lib/database.types";
import { useSession } from "next-auth/react";
import supabaseBowrserClient from "@src/utils/supabase-browser";
import { classNames } from "@src/helpers";
import { generateDeployParams, generateMetadata } from "@src/helpers/deploy";
import { cleanBaseUri, resolveIPFS } from "@src/utils/resolveIPFS";
import { useEvmUploadFolder } from "@moralisweb3/next";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { UHMFACTORY_ABI } from "@lib/contracts/abis";
import { UHMFACTORY_ADDRESS } from "@lib/contracts";
import { ethers } from "ethers";
import Link from "next/link";
import { getTXUrl } from "@src/utils/format";

type Collection = Database["public"]["Tables"]["collections"]["Row"];
type Stem = Database["public"]["Tables"]["stems"]["Row"];

interface DeployModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  collectionId: Collection["id"];
}

export default function DeployModal({
  open,
  setOpen,
  collectionId,
}: DeployModalProps) {
  const { data: session } = useSession();

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [preparing, setPrepare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any[]>([]);
  const [deployArgs, setDeployArgs] = useState<any | null>(null);
  const [txHash, setTxHash] = useState<string| null>(null);
  const [collection, setCollection] = useState<Collection>();
  const [stems, setStems] = useState<Stem[]>([]);

  const { data: ipfsUrl, error, fetch, isFetching } = useEvmUploadFolder();

  const {
    data: deployFee,
    isError,
    isLoading: isLoadingRead,
  } = useContractRead({
    address: UHMFACTORY_ADDRESS,
    abi: UHMFACTORY_ABI,
    functionName: "deployFee",
  });

  const { config } = usePrepareContractWrite({
    address: UHMFACTORY_ADDRESS,
    abi: UHMFACTORY_ABI,
    functionName: "deployERC1155",
    args: deployArgs,
    enabled: Boolean(deployArgs),
    overrides: {
      value: ethers.BigNumber.from(deployFee),
    },
  });
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config);

  const addRecentTransaction = useAddRecentTransaction();

  useEffect(() => {
    if (collectionId && !collection) getCollection();

    if (stems.length > 0) getData();
  }, [collectionId, stems]);

  async function getData() {
    console.log("getData");
    if (collection && stems && stems?.length > 0) {
      const _metadata = generateMetadata(collection, stems);
      setMetadata(_metadata);
      console.log(metadata);
    } else {
      toast.error("Add atleast one STEM");
    }
  }

  async function getCollection() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("collections")
        .select(`*, stems (*)`)
        .eq("stems.collection_id", collectionId)
        .eq("id", collectionId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCollection(data);
        setStems(data.stems as Stem[]);
      }
    } catch (error) {
      toast.error("Error Loading Collection");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function prepareDeployment() {
    try {
      setPrepare(true);
      if (metadata.length == 0) throw new Error("No metadata");
      if (!collection || !stems) throw new Error("No data");

      const uri = await fetch({ abi: metadata });
      if (uri) {
        const lastItem = uri[0].path.split("/").pop();
        const baseUri = cleanBaseUri(uri[0].path, lastItem);
        // const deployParams = { uri: baseUri, ...generateDeployParams(collection, stems) }
        const deployParams = generateDeployParams(collection, stems, baseUri!);
        setDeployArgs(deployParams);
        console.log(deployParams);
        console.log("Deploying....");
      }
    } catch (error) {
      toast.error("Error Deploying Collection");
      console.log(error);
    } finally {
      setPrepare(false);
    }
  }

  async function deploy() {
    try {
      const tx = await writeAsync?.();
      if (tx) {
        addRecentTransaction({
          hash: tx?.hash,
          description: "Deploying Collection",
        });
        setDeployArgs(null)
        setTxHash(tx.hash)
      }
    } catch (error) {
      console.log(error);
      
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

                  <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                    <div className="sm:col-span-4 lg:col-span-5">
                      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={
                            collection?.thumbnail_url
                              ? resolveIPFS(collection.thumbnail_url)!
                              : ""
                          }
                          alt="thumbnail"
                          className="object-cover object-center"
                          width={150}
                          height={150}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                        {collection?.name}
                      </h2>

                      <section
                        aria-labelledby="information-heading"
                        className="mt-3"
                      >
                        <h3 id="information-heading" className="sr-only">
                          Product information
                        </h3>

                        <div className="mt-2">
                          <h4 className="sr-only">Description</h4>
                          <p className="text-sm text-gray-700">
                            {collection?.description}
                          </p>
                        </div>
                      </section>

                      <section
                        aria-labelledby="options-heading"
                        className="mt-6"
                      >
                        <h3 id="options-heading" className="sr-only">
                          Stem Info
                        </h3>
                        <div>
                          {stems.length == 0 ? (
                            <div className="rounded-md bg-yellow-50 p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <ExclamationTriangleIcon
                                    className="h-5 w-5 text-yellow-400"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-yellow-800">
                                    {`${stems.length} STEM Token`}
                                  </h3>
                                  <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                      You must add atleast one stem in order to
                                      deploy a collection.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h2 className="text-sm font-medium text-gray-500">
                                {`${stems.length} STEM Token`}
                              </h2>
                              <ul
                                role="list"
                                className="mt-3 grid grid-cols-1 gap-5"
                              >
                                {stems.map((stem) => (
                                  <li
                                    key={stem.id}
                                    className="col-span-1 flex rounded-md shadow-sm"
                                  >
                                    <div
                                      className={classNames(
                                        "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                                      )}
                                    >
                                      <Image
                                        className="h-16 w-16 rounded-lg"
                                        src={
                                          stem.image_hash
                                            ? resolveIPFS(stem.image_hash)!
                                            : ""
                                        }
                                        alt=""
                                        width={48}
                                        height={48}
                                      />
                                    </div>
                                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                                      <div className="flex-1 truncate px-4 py-2 text-sm">
                                        <p className="font-medium text-gray-900 hover:text-gray-600">
                                          {`ID: ${stem.token_id} - ${stem.name}`}
                                        </p>
                                        <p className="text-gray-500">
                                          {`Supply: ${stem.supply} - Price: ${stem.price}`}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="mt-6">
                            {stems.length > 0 && (!txHash && !deployArgs) && (
                              <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                onClick={() => prepareDeployment()}
                                disabled={preparing}
                              >
                                {preparing
                                  ? "Preparing..."
                                  : "Step: 1 - Prepare for Deployment"}
                              </button>
                            )}
                            {deployArgs && (
                              <button
                                type="submit"
                                className="disabled:bg-gray-300 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                onClick={() => deploy()}
                                disabled={isLoading}
                              >
                                {isLoading
                                  ? "Deploying..."
                                  : "Step: 2 - Deploy"}
                              </button>
                            )}
                            {txHash && (
                              <Link className="text-indigo-500 hover:underline flex w-full items-center justify-center" href={getTXUrl(txHash)} target="_blank">View Transaction</Link>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
