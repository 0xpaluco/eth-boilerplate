export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  next_auth: {
    Tables: {
      accounts: {
        Row: {
          type: string
          provider: string
          providerAccountId: string
          refresh_token: string | null
          access_token: string | null
          expires_at: number | null
          token_type: string | null
          scope: string | null
          id_token: string | null
          session_state: string | null
          oauth_token_secret: string | null
          oauth_token: string | null
          userId: string | null
          id: string
        }
        Insert: {
          type: string
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
          userId?: string | null
          id?: string
        }
        Update: {
          type?: string
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
          userId?: string | null
          id?: string
        }
      }
      sessions: {
        Row: {
          expires: string
          sessionToken: string
          userId: string | null
          id: string
        }
        Insert: {
          expires: string
          sessionToken: string
          userId?: string | null
          id?: string
        }
        Update: {
          expires?: string
          sessionToken?: string
          userId?: string | null
          id?: string
        }
      }
      users: {
        Row: {
          moralis_provider_id: string | null
          metadata: Json | null
          id: string
          created_at: string | null
        }
        Insert: {
          moralis_provider_id?: string | null
          metadata?: Json | null
          id?: string
          created_at?: string | null
        }
        Update: {
          moralis_provider_id?: string | null
          metadata?: Json | null
          id?: string
          created_at?: string | null
        }
      }
      verification_tokens: {
        Row: {
          identifier: string | null
          token: string
          expires: string
        }
        Insert: {
          identifier?: string | null
          token: string
          expires: string
        }
        Update: {
          identifier?: string | null
          token?: string
          expires?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      collections: {
        Row: {
          name: string | null
          slug: string | null
          description: string | null
          owner_address: string | null
          thumbnail_url: string | null
          banner_url: string | null
          created_at: string | null
          updated_at: string | null
          draft: boolean
          id: number
          user_id: string | null
        }
        Insert: {
          name?: string | null
          slug?: string | null
          description?: string | null
          owner_address?: string | null
          thumbnail_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          draft?: boolean
          id?: number
          user_id?: string | null
        }
        Update: {
          name?: string | null
          slug?: string | null
          description?: string | null
          owner_address?: string | null
          thumbnail_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          draft?: boolean
          id?: number
          user_id?: string | null
        }
      }
      stems: {
        Row: {
          created_at: string | null
          updated_at: string | null
          instrument: string | null
          bpm: number | null
          key: string | null
          genre: string | null
          license: string | null
          id: number
          collection_id: number
          token_id: number | null
          name: string | null
          description: string | null
          image_hash: string | null
          audio_hash: string | null
          supply: number | null
          price: number | null
        }
        Insert: {
          created_at?: string | null
          updated_at?: string | null
          instrument?: string | null
          bpm?: number | null
          key?: string | null
          genre?: string | null
          license?: string | null
          id?: number
          collection_id: number
          token_id?: number | null
          name?: string | null
          description?: string | null
          image_hash?: string | null
          audio_hash?: string | null
          supply?: number | null
          price?: number | null
        }
        Update: {
          created_at?: string | null
          updated_at?: string | null
          instrument?: string | null
          bpm?: number | null
          key?: string | null
          genre?: string | null
          license?: string | null
          id?: number
          collection_id?: number
          token_id?: number | null
          name?: string | null
          description?: string | null
          image_hash?: string | null
          audio_hash?: string | null
          supply?: number | null
          price?: number | null
        }
      }
      users: {
        Row: {
          id: string
          moralis_provider_id: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          moralis_provider_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          moralis_provider_id?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

