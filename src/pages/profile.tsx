import { NextPageWithLayout } from "@lib/types";
import { Nft } from "@lib/types/web3";

import WithLayout, { MainLayout } from "@src/layouts";
import { ProfileView } from "@src/views";
import { ReactElement} from "react";

import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import type { Session } from "next-auth";

import { getSession } from "next-auth/react";

import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

interface PageProps {
  error?: Error
  session: Session
  address?: string
  nftList?: Nft[]
  //children?: ReactNode;
}


export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {

  const session = await getSession(context)
  
  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  const chain = EvmChain.create(session.user.chainId);
  const address = session.user.address;

  if(!Moralis.Core.isStarted){
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  const nftList = await Moralis.EvmApi.nft.getWalletNFTs({
    chain,
    address,
  });  

  // console.log(nftList.raw.result);
  
  return {
    props: { session, address, nftList: (nftList.raw.result as Nft[]) },
  };

}


const ProfilePage: NextPageWithLayout<PageProps> = ({ session, address, nftList }) => {
  return <ProfileView session={session} address={address} nftList={nftList}/>
}

ProfilePage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  return <WithLayout layout={MainLayout} component={page} />
}

ProfilePage.auth = false;

export default ProfilePage