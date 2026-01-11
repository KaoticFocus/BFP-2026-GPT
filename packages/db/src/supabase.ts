// BuildFlow Pro AI - Supabase Client
// ==================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Singleton pattern for Supabase Client (lazy initialization)
const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient<Database> | undefined;
  supabaseAdmin: SupabaseClient<Database> | undefined;
};

/**
 * Get Supabase URL from environment
 */
function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  return url;
}

/**
 * Get Supabase anon key from environment
 */
function getSupabaseAnonKey(): string {
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  return key;
}

/**
 * Get or create the public Supabase client (uses anon key)
 * - Respects RLS policies
 * - Safe to use in browser/client-side code
 */
export function getSupabase(): SupabaseClient<Database> {
  if (globalForSupabase.supabase) {
    return globalForSupabase.supabase;
  }

  const client = createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabase = client;
  }

  return client;
}

/**
 * Get or create the admin Supabase client (uses service role key)
 * - Bypasses RLS policies
 * - ONLY use in server-side code (API routes, workers)
 * - NEVER expose to client
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (globalForSupabase.supabaseAdmin) {
    return globalForSupabase.supabaseAdmin;
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      'supabaseAdmin requires SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'This client should only be used in server-side code.'
    );
  }

  const client = createClient<Database>(getSupabaseUrl(), serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabaseAdmin = client;
  }

  return client;
}

/**
 * Create a Supabase client with a specific user's JWT
 * Useful for impersonating users in API routes
 */
export function createSupabaseClient(accessToken?: string): SupabaseClient<Database> {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    },
  });
}

// Legacy exports for backwards compatibility (lazy getters)
// These throw at access time, not import time
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    return Reflect.get(getSupabase(), prop);
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    return Reflect.get(getSupabaseAdmin(), prop);
  },
});

// Export types
export type { Database } from './database.types';
export type { SupabaseClient } from '@supabase/supabase-js';

// Re-export useful Supabase utilities
export { createClient } from '@supabase/supabase-js';
