import { Metadata, Nft } from "@lib/types/web3";
import { EvmNft } from "@moralisweb3/common-evm-utils";
import { resolveIPFS } from "@src/utils/resolveIPFS";
import { useState } from "react";
import NftDetail from "../NftDetail";

interface NftGridProps {
  nftList?: EvmNft[];
}

export default function NftGrid({ nftList }: NftGridProps) {

  const [open, setOpen] = useState(false);
  const [nft, setNft] = useState<EvmNft | undefined>(nftList ? nftList[0] : undefined);


  async function setDetail(_nft: EvmNft) {
    setNft(_nft)
    setOpen(true)
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {nftList?.map((_nft, index) => (
            <div
              key={index}
              className="group relative border-r border-b border-gray-200 p-4 sm:p-6 bg-white"
            >
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-800 group-hover:opacity-75">
                <img
                  src={
                    resolveIPFS((_nft.metadata as unknown as Metadata).image)
                  }
                  alt={""}
                  className="h-full w-full object-cover object-center align-middle"
                />
              </div>
              <div className="pt-8 pb-2 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <button onClick={() => setDetail(_nft)}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {(_nft.metadata as unknown as Metadata).name}  
                  </button>
                </h3>
                <div className="mt-1 flex flex-col items-center">
                  <p className="sr-only">{_nft.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{_nft.name}</p>
                </div>
                <p className="mt-1 text-base font-medium text-gray-500">
                  Qty Owned: {_nft.amount}
                </p>
              </div>
            </div>
          ))}
        </div>

        {nft && (
            <NftDetail open={open} setOpen={setOpen} nft={nft} metadata={(nft.metadata as unknown as Metadata)}/>
        )}
        
      </div>
    </div>
  );
}
