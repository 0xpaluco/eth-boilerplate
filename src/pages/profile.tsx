import { NextPageWithLayout } from "@lib/types";

import WithLayout, { MainLayout } from "@src/layouts";
import { ProfileView } from "@src/views";
import { ReactElement} from "react";

import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getServerSession } from "next-auth";

import { authOptions } from "./api/auth/[...nextauth]";

interface PageProps {
  error?: Error
  address?: string
  needAuth: boolean
  //children?: ReactNode;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {

  const session = await getServerSession(context.req, context.res, authOptions)

  if(!session){
    return {
      props: { needAuth: true },
    };
  }
  
  const address = session.user.address;

  return {
    props: { address, needAuth: true },
  };

}

const ProfilePage: NextPageWithLayout<PageProps> = ({ address }) => {
  return <ProfileView address={address} />
}

ProfilePage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  return <WithLayout layout={MainLayout} component={page} />
}

ProfilePage.auth = true;

export default ProfilePage