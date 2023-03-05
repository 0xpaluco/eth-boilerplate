import { headers, cookies } from 'next/headers'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@lib/database.types'

const supabaseServerClient = ({ jwt }: { jwt: string | undefined }) =>
  createServerComponentSupabaseClient<Database>({
    supabaseUrl: process.env.SUPABASE_URL, 
    supabaseKey: process.env.SUPABASE_ANON_KEY, 
    options: { global: { headers: { Authorization: `Bearer ${jwt}` } } },
    headers,
    cookies,
  })

export default supabaseServerClient