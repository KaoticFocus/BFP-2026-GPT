// BuildFlow Pro AI - Database Client
// ===================================
// Supports both Prisma (for complex queries) and Supabase (for realtime/auth)

// Lazy Prisma client to avoid errors during build
type PrismaClientType = import('@prisma/client').PrismaClient;
let _prismaClient: PrismaClientType | null = null;

/**
 * Get the Prisma client instance
 * Lazy-loaded to avoid issues during build time
 */
export function getPrisma(): PrismaClientType {
  if (_prismaClient) {
    return _prismaClient;
  }

  {
    // Dynamic import to avoid build-time errors
    const { PrismaClient } = require('@prisma/client');
    _prismaClient = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  return _prismaClient;
}

// Legacy export using Proxy for backwards compatibility
// Throws at access time, not import time
export const prisma = new Proxy({} as import('@prisma/client').PrismaClient, {
  get(_, prop) {
    return Reflect.get(getPrisma(), prop);
  },
});

// Re-export types (these are safe at build time)
export type { PrismaClient, Prisma } from '@prisma/client';

// Re-export Supabase client (lazy-loaded)
export { 
  supabase, 
  supabaseAdmin, 
  createSupabaseClient,
  getSupabase,
  getSupabaseAdmin 
} from './supabase';
export type { Database, SupabaseClient } from './supabase';
