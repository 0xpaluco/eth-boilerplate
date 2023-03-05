import { Dispatch, Fragment, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/20/solid";
import { Metadata } from "@lib/types/web3";
import { resolveIPFS } from "@src/utils/resolveIPFS";
import { getEllipsisTxt } from "@src/utils/format";
import { EvmNft } from "@moralisweb3/common-evm-utils";

interface NftDetailProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  nft: EvmNft;
  metadata: Metadata;
}

export default function NftDetail({
  open,
  setOpen,
  nft,
  metadata,
}: NftDetailProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-96">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-white p-8">
                    <div className="space-y-6 pb-16">
                      <div>
                        <div className="aspect-w-1 aspect-h-1 block w-full overflow-hidden rounded-lg">
                          <img
                            src={resolveIPFS(metadata.image)}
                            alt=""
                            className="object-cover w-full"
                          />
                        </div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="text-base font-semibold leading-6 text-gray-900">
                              <span className="sr-only">
                                Details for {metadata.name}
                              </span>
                              {metadata.name}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">{`${nft.name} - ID: ${metadata.id}`}</p>
                          </div>
                          <button
                            type="button"
                            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-600 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <PlayIcon className="h-6 w-6" aria-hidden="true" />
                            <span className="sr-only">Play Sound</span>
                          </button>
                        </div>
                      </div>

                      {metadata.attributes && (
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Information
                          </h3>
                          <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                            {metadata.attributes?.map((attr, index) => (
                              <div className="flex justify-between py-3 text-sm font-medium" key={index}>
                                <dt className="text-gray-500">
                                  {attr.trait_type}
                                </dt>
                                <dd className="text-gray-900">{attr.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium text-gray-900">
                          Description
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm italic text-gray-500">
                            {metadata.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Owned By</h3>
                        <ul
                          role="list"
                          className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200"
                        >
                          <li className="flex items-center justify-between py-3" key={'owner'}>
                            <div className="flex items-center">
                              <p className="ml-4 text-sm font-medium text-gray-900">
                                {getEllipsisTxt(nft.ownerOf?.format("checksum"))}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Sell
                        </button>
                        <button
                          type="button"
                          className="ml-3 flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
