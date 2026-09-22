import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [{ source: '/', destination: '/ar', permanent: false }];
  },
};

export default nextConfig;
