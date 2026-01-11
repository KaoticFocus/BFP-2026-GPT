// BuildFlow Pro AI - Database Client
// ===================================
// Supports both Prisma (for complex queries) and Supabase (for realtime/auth)

import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
export * from '@prisma/client';

// Re-export types for convenience
export type { Prisma } from '@prisma/client';

// Re-export Supabase client
export { supabase, supabaseAdmin, createSupabaseClient } from './supabase';
export type { Database, SupabaseClient } from './supabase';
