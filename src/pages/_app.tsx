import "@rainbow-me/rainbowkit/styles.css";
import "@src/styles/globals.css";

import { useEffect } from "react";
import { AppPropsWithLayout } from "@lib/types";

import WithLayout, { MainLayout } from "@src/layouts";
import { AuthView } from "@src/views";


import { createClient, configureChains, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai, localhost } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { SessionProvider, useSession } from "next-auth/react";

import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme
} from "@rainbow-me/rainbowkit";


const { provider, webSocketProvider, chains } = configureChains(
  [polygon, polygonMumbai, localhost],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN!,
  statement: 'Please sign this message to confirm your identity.',
  uri: process.env.NEXT_PUBLIC_NEXTAUTH_URL!,
  timeout: 60
})


export default function App({
  Component,
  session,
  pageProps,
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <WagmiConfig client={client}>
      <SessionProvider session={session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions} enabled={false} 
        >
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            theme={lightTheme()}
          >
            {Component.auth ? (
              <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
            ) : (
              getLayout(<Component {...pageProps} />)
            )}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

interface AuthProps {
  children: any;
}
function Auth({ children }: AuthProps) {
  const { status } = useSession()
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isUnAuthenticated = status === "unauthenticated";

  useEffect(() => {
    console.log(`isAuthenticated: ${isAuthenticated}`);
    console.log(`isLoading: ${isLoading}`);
  },[isLoading, isAuthenticated])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isUnAuthenticated) {
    return <WithLayout layout={MainLayout} component={<AuthView/>} /> 
  }

  if (isAuthenticated) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  // return <AuthView />
  return <h2>Connect Wallet</h2>
}
