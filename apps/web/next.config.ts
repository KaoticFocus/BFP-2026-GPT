import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '50mb' },
  },
  transpilePackages: ['@buildflow/shared', '@buildflow/ui'],
};

export default nextConfig;
