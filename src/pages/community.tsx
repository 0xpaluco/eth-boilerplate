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
  session?: Session
  address?: string
  needAuth: boolean
  //children?: ReactNode;
}


export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {

  const session = await getSession(context)
 
  if(!session){
    return {
      props: { needAuth: true },
    };
  }

 const address = session.user.address;
  return {
    props: { session, address, needAuth: false },
  };

}


const CommunityPage: NextPageWithLayout<PageProps> = ({ session, address, needAuth }) => {
  return <h1>Community View</h1>
}

CommunityPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  return <WithLayout layout={MainLayout} component={page} />
}

CommunityPage.auth = false;

export default CommunityPage