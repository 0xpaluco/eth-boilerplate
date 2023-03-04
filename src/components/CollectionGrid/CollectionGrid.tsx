import { STEMV1_ABI } from "@lib/contractsAbis";
import { EvmNftCollection } from "@moralisweb3/common-evm-utils";
import { useEvmRunContractFunction } from "@moralisweb3/next";
import supabaseBowrserClient from "@src/utils/supabase-browser";
import { BigNumber } from "ethers";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

const products = [
  {
    id: 1,
    name: "Basic Tee 8-Pack",
    href: "#",
    price: "$256",
    description:
      "Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.",
    options: "8 colors",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg",
    imageAlt:
      "Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  // More products...
];

interface CollectionCardProps {
  collection: EvmNftCollection;
  index: number;
}

interface StemData {
  id: BigNumber;
  name: string;
  supply: BigNumber;
  mintFee: BigNumber;
}

const CollectionCard = ({ collection, index }: CollectionCardProps) => {
  // const [stems, setStems] = useState<StemData[]>()
//   const [loading, setLoading] = useState(true);

//   const { data: session } = useSession();
//   const [supabase] = useState(() =>
//     supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
//   );
//   const [description, setDescription] = useState<Users["description"]>(null);

//   useEffect(() => {
//     // getCollection();
//   }, [collection]);

//   async function getCollection() {
//     try {
//       setLoading(true);
//       if (!session?.user) throw new Error("No user");

//       let { data, error, status } = await supabase
//         .from("collections")
//         .select(`description`)
//         .eq("tokenAddress", collection.tokenAddress)
//         .single();

//       if (error && status !== 406) {
//         throw error;
//       }

//       if (data) {
//         setProvidsetDescriptionerId(data.description);
//       }
//     } catch (error) {
//       alert("Error loading user data!");
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   }

  return (
    <div
      key={index}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-96">
        <img
          src={
            "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg"
          }
          alt={"collection cover art"}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/collections/${collection.tokenAddress.checksum}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {collection.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">
          This collection has no description yet. Contact the owner of this
          collection about setting it up on Uhmbrella!
        </p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-sm italic text-gray-500">xxx</p>
          <p className="text-base font-medium text-gray-900">$123</p>
        </div>
      </div>
    </div>
  );
};

interface CollectionProps {
  collections?: EvmNftCollection[];
}
export default function CollectionGrid({ collections }: CollectionProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {collections?.map((collection, index) => (
            <CollectionCard collection={collection} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
