import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@lib/database.types'


const supabaseBowrserClient = ({ jwt }: { jwt: string | undefined }) => createBrowserSupabaseClient<Database>({ supabaseUrl: process.env.SUPABASE_URL, supabaseKey: process.env.SUPABASE_ANON_KEY, options: { global: { headers: { Authorization: `Bearer ${jwt}` } } } });

export default supabaseBowrserClient;