import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id:        string;
    domain:    string;
    chainId:   number;
    address:   string;
    statement: string;
    uri:       string;
    version:   string;
    nonce:     string;
    profileId: string;
    payload:   null;
    expirationTime?: ISODateString;
  };

  interface JWT {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    user: User
  }

  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken?: string
    user: User
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface User {
    id:        string;
    domain:    string;
    chainId:   number;
    address:   string;
    statement: string;
    uri:       string;
    version:   string;
    nonce:     string;
    profileId: string;
    payload:   null;
    expirationTime?: ISODateString;
  };

  interface JWT {
    /** OpenID ID Token */
    user: User,
    supabaseAccessToken?: string
  }
}