// BuildFlow Pro AI - Supabase Client
// ==================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

// Singleton pattern for Supabase Client
const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient<Database> | undefined;
  supabaseAdmin: SupabaseClient<Database> | undefined;
};

/**
 * Public Supabase client (uses anon key)
 * - Respects RLS policies
 * - Safe to use in browser/client-side code
 */
export const supabase =
  globalForSupabase.supabase ??
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}

/**
 * Admin Supabase client (uses service role key)
 * - Bypasses RLS policies
 * - ONLY use in server-side code (API routes, workers)
 * - NEVER expose to client
 */
export const supabaseAdmin = (() => {
  if (!supabaseServiceKey) {
    // Return a proxy that throws if accessed without service key
    return new Proxy({} as SupabaseClient<Database>, {
      get() {
        throw new Error(
          'supabaseAdmin requires SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
          'This client should only be used in server-side code.'
        );
      },
    });
  }

  if (globalForSupabase.supabaseAdmin) {
    return globalForSupabase.supabaseAdmin;
  }

  const client = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabaseAdmin = client;
  }

  return client;
})();

/**
 * Create a Supabase client with a specific user's JWT
 * Useful for impersonating users in API routes
 */
export function createSupabaseClient(accessToken?: string) {
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    },
  });
}

// Export types
export type { Database } from './database.types';
export type { SupabaseClient } from '@supabase/supabase-js';

// Re-export useful Supabase utilities
export { createClient } from '@supabase/supabase-js';
