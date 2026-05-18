import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  async redirects() {
    return [{ source: '/aprendizaje', destination: '/ruta-aprendizaje', permanent: true }];
  },
};

export default nextConfig;
