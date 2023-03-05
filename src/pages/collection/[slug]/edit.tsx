import { NextPageWithLayout } from "@lib/types";

import WithLayout, { MainLayout } from "@src/layouts";
import { ReactElement} from "react";

import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@src/pages/api/auth/[...nextauth]";
import { EditCollectionView } from "@src/views";

interface PageProps {
  error?: Error
  session?: Session
  address?: string
  needAuth: boolean
  collectionId?: string | string[]
  //children?: ReactNode;
}


export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {

  const session = await getServerSession(context.req, context.res, authOptions)

  const params = context.params
  console.log(params?.slug);
  
 
  if(!session){
    return {
      props: { needAuth: true },
    };
  }

 const address = session.user.address;
 const slug = params?.slug?.toString()
  return {
    props: { session, address, collectionId: slug,  needAuth: true },
  };

}


const CollectionEditPage: NextPageWithLayout<PageProps> = ({ session, address, needAuth, collectionId }) => {
  return (<EditCollectionView collectionId={collectionId}/>)
}

CollectionEditPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  return <WithLayout layout={MainLayout} component={page} />
}

CollectionEditPage.auth = true;

export default CollectionEditPage