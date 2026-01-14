import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton pour le client public (côté client)
let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

// Client admin pour les API routes (côté serveur)
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase admin environment variables');
  }
  
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
