import { useEffect, useState } from "react";
import supabaseBowrserClient from "@src/utils/supabase-browser";
import { getAddressInitials, getEllipsisTxt } from "@src/utils/format";

import { Database } from "@lib/database.types";
type Collections = Database["public"]["Tables"]["collections"]["Row"];

import { NftGrid } from "@src/components";

import { useEvmResolveAddress, useEvmWalletNFTs } from "@moralisweb3/next";

import { useNetwork } from "wagmi";
import { useSession } from "next-auth/react";

interface ProfileProps {
  address?: string;
}

const ProfileView = ({ address }: ProfileProps) => {
  const { data: session } = useSession();
  const { chain } = useNetwork();
  const { data: ens } = useEvmResolveAddress({ address });
  const { data: nftList } = useEvmWalletNFTs({
    address: address!,
    chain: chain?.id,
  });

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collections[]>();

  const stats = [
    {
      name: "Collections Pusblished",
      value: collections?.length || 0,
    },
    {
      name: "STEMS Owned",
      value: nftList?.length || 0,
    },
    { name: "Communities Joined", value: 0 },
  ];

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
        .eq("owner_address", address)
        .eq("draft", false);

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
    <>
      <div className="rounded-lg bg-white shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0 text-center">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-500">
                  <span className="text-xl font-medium leading-none text-white">
                    {getAddressInitials(address, 6)}
                  </span>
                </span>
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">
                  Welcome back,
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {ens ? ens.name : getEllipsisTxt(address, 6)}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {ens ? getEllipsisTxt(address, 10) : ""}
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              <button
                onClick={() => {}}
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Some action
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="px-6 py-5 text-center text-sm font-medium"
            >
              <span className="text-gray-900">{stat.value}</span>{" "}
              <span className="text-gray-600">{stat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <NftGrid nftList={nftList} />
      </div>
    </>
  );
};

export default ProfileView;
