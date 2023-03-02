import NextAuth, { User } from "next-auth";
import type { NextAuthOptions } from 'next-auth'
import { MoralisNextAuthProvider } from "@moralisweb3/next";

import { createClient } from '@supabase/supabase-js';
import jwt from "jsonwebtoken"

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE || "", { db: { schema: "next_auth"} });

const saveUser = async (authData: User) : Promise<string> =>  {
  console.log('save user');
  console.log(authData);

  let uuid = ""
  
  let { data: user } = await supabase.from('users').select('*').eq('moralis_provider_id', authData.profileId).single();
  console.log(user);
  if(user){
    uuid = user.id
  }
  if (!user && authData.profileId) {
    const response = await supabase
      .from('users')
      .insert({ moralis_provider_id: authData.profileId, metadata: authData })
      .single();
      console.log(response);
  }

  return uuid;
}

export const authOptions: NextAuthOptions = {
  // your configs
  providers: [MoralisNextAuthProvider()],
  pages: { signIn: '/' },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {      
      if (user) 
        token.user = user;
      
      if(token.user) {
        const savedUser = await saveUser(token.user);
        const signingSecret = process.env.SUPABASE_JWT || ""
        if (signingSecret) {
          const payload = {
            aud: "authenticated",
            role: "authenticated",
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            sub: savedUser,
          }
          token.supabaseAccessToken = jwt.sign(payload, signingSecret)
        }
      }
      return token;
    },
    async session({ session, token }) {      
      session.user = (token.user as User);
      session.supabaseAccessToken = token.supabaseAccessToken;
      return session;
    },
  },
}

export default NextAuth(authOptions);