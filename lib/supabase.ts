import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

/**
 * Public Client (Browser & Read Operations)
 */
export const supabasePublic: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey || supabaseServiceKey!)
  : null;

/**
 * Admin Service Client (Server-side Only: Mutations, Storage, Vector Operations)
 */
export const supabaseAdmin: SupabaseClient | null = isSupabaseConfigured && supabaseServiceKey
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
