import { NextPageWithLayout } from "@lib/types";
import WithLayout, { MainLayout } from "@src/layouts";
import { HomeView } from "@src/views";
import { ReactElement } from "react";

interface PageProps {
  error?: Error
  //children?: ReactNode;
}

const HomePage: NextPageWithLayout<PageProps> = ({}) => {
  return <HomeView />
}

HomePage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  return <WithLayout layout={MainLayout} component={page} />
}

HomePage.auth = false;

export default HomePage