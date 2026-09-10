import type { NextConfig } from 'next';
import { next } from '@repo/constants';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  ...next,
};

export default nextConfig;
