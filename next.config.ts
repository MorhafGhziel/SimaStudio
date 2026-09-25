import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/', destination: '/ar', permanent: false },
      // The Starbucks concept was taken out of the portfolio; old links land on the work section.
      { source: '/:locale(ar|en)/work/starbucks', destination: '/:locale#work', permanent: true },
    ];
  },
};

export default nextConfig;
