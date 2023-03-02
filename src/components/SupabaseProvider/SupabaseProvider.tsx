import { SupabaseClient } from '@supabase/supabase-js';
import { Session, User } from 'next-auth';
import { createContext, useContext, useState } from 'react';
import { Database } from '@lib/database.types'
import createBrowserClient from '@src/utils/supabase-browser';

type MaybeSession = Session | null;
type MaybeUser = User | null;
export type TypedSupabaseClient = SupabaseClient<Database>;

type SupabaseContext = {
    supabase: TypedSupabaseClient;
    session: MaybeSession
    user?: MaybeUser
};

interface ProvideProps {
    children: React.ReactNode;
    session: MaybeSession
}

// @ts-ignore
const Context = createContext<SupabaseContext>();

export default function SupabaseProvider({ children, session }: ProvideProps) {

  //  const { data: session, status } = useSession()    
    const [supabase] = useState(() => createBrowserClient({ jwt: session?.supabaseAccessToken }));

    return (
        <Context.Provider value={{ supabase, session: session, user: session?.user }}>
            <>{children} </>
        </Context.Provider>
    )
}

export const useSupabase = () => useContext(Context)