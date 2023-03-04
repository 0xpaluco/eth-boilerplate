import { NextPageWithLayout } from "@lib/types";

import WithLayout, { MainLayout } from "@src/layouts";
import { ReactElement } from "react";

import type { GetServerSideProps, GetServerSidePropsContext } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { CollectionsView } from "@src/views";

interface PageProps {
  error?: Error;
  address?: string;
  needAuth: boolean;
  //children?: ReactNode;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: { needAuth: true },
    };
  }

  const address = session.user.address;
  return {
    props: { address, needAuth: true },
  };
};

const CollectionsPage: NextPageWithLayout<PageProps> = ({
  address,
  needAuth,
}) => {
  return <CollectionsView address={address} />;
};

CollectionsPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  return <WithLayout layout={MainLayout} component={page} />;
};

CollectionsPage.auth = true;

export default CollectionsPage;
