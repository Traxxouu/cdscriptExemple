import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client public (côté client + serveur) - lazy initialization
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (typeof window === 'undefined') {
    // Server-side: create new instance each time or return dummy for build
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      // Return a dummy client for build time
      return null as any;
    }
    
    return createClient(url, key);
  }
  
  // Client-side: reuse instance
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (url && key) {
      supabaseInstance = createClient(url, key);
    }
  }
  
  return supabaseInstance as SupabaseClient;
})();

// Helper function to get supabase client safely
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// Client admin (uniquement côté serveur dans les API routes)
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin credentials not configured');
  }
  
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
