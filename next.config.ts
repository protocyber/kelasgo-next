import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy API requests to the backend using env API_URL (e.g. http://localhost:8080/v1)
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
