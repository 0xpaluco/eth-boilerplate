import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession, signOut } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";

function WalletConnect() {
  const { isConnected, address } = useAccount({ onDisconnect() {
    signOut()
  },});
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  useEffect(() => {
    const handleAuth = async () => {
      if (!address) {
        throw new Error("No account found");
      }
      if (!chain) {
        throw new Error("No chain found");
      }

      const challenge = await requestChallengeAsync({
        address: address,
        chainId: chain.id,
      });
      const message = challenge?.message ?? "";
      const signature = await signMessageAsync({ message });

      // redirect user after success authentication to '/user' page
      const x = await signIn("moralis-auth", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/profile",
      });
      // /**
      //  * instead of using signIn(..., redirect: "/user")
      //  * we get the url from callback and push it to the router to avoid page refreshing
      //  */
      push(x?.url!);
    };
    
    if (status === "unauthenticated" && isConnected) {
      handleAuth();
    }

  }, [status, isConnected]);

  return (
    <div className="flex items-center">
      <ConnectButton
        label={"Connect Wallet"}
        chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
        accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
        showBalance={{ smallScreen: false, largeScreen: true }}
      />
    </div>
  );
}

export default WalletConnect;
