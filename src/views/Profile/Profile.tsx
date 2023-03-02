import { useEffect, useState } from "react";
import supabaseBowrserClient from "@src/utils/supabase-browser";

import { Database } from "@lib/database.types";
type Users = Database["public"]["Tables"]["users"]["Row"];

import type { Session } from "next-auth";
import Image from "next/image";
import { NftGrid } from "@src/components";
import { Nft } from "@lib/types/web3";
import { getAddressInitials, getEllipsisTxt } from "@src/utils/format";
import { useEvmResolveAddress } from "@moralisweb3/next";

interface ProfileProps {
  session: Session;
  address?: string;
  nftList?: Nft[];
}

const ProfileView = ({ session, address, nftList }: ProfileProps) => {
  const [nftOwned] = useState(nftList?.length);
  const [loading, setLoading] = useState(true);

  const [providerId, setProviderId] =
    useState<Users["moralis_provider_id"]>(null);
  // const [username, setUsername] = useState<Users['username']>(null)
  // const [avatar_url, setAvatarUrl] = useState<Users['avatar_url']>(null)

  const { data: ens } = useEvmResolveAddress({ address });

  const stats = [
    { label: "Collections Created", value: 12 },
    { label: "NFTs Owned", value: nftOwned },
    { label: "Communities Joined", value: 0 },
  ];

  const [supabase] = useState(() =>
    supabaseBowrserClient({ jwt: session?.supabaseAccessToken })
  );

  useEffect(() => {
    console.log(session);
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session.user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("users")
        .select(`moralis_provider_id`)
        .eq("moralis_provider_id", session.user.profileId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProviderId(data.moralis_provider_id);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // async function updateProfile({
  //   username,
  //   avatar_url,
  // }: {
  //   username: Users['username']
  //   avatar_url: Users['avatar_url']
  // }) {
  //   try {
  //     setLoading(true)
  //     if (!session.user) throw new Error('No user')

  //     const updates = {
  //       id: user.id,
  //       username,
  //       avatar_url,
  //       updated_at: new Date().toISOString(),
  //     }

  //     let { error } = await supabase.from('users').upsert(updates)
  //     if (error) throw error
  //     alert('User updated!')
  //   } catch (error) {
  //     alert('Error updating the data!')
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <>
      <div className="rounded-lg bg-white shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                {/* <Image
                  className="mx-auto h-20 w-20 rounded-full"
                  src={""}
                  alt=""
                  width={80}
                  height={80}
                  placeholder="blur"
                  blurDataURL="https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png"
                /> */}
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-500">
                  <span className="text-xl font-medium leading-none text-white">{getAddressInitials(address, 6)}</span>
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
              key={stat.label}
              className="px-6 py-5 text-center text-sm font-medium"
            >
              <span className="text-gray-900">{stat.value}</span>{" "}
              <span className="text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <NftGrid nftList={nftList} />
    </>
  );
};

export default ProfileView;
