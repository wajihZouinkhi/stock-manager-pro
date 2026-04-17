/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {},
  async rewrites() {
    return [
      {
        source: '/api:path**',
        destination: 'http://localhost:3001/api:path*',
      },
    ];
  },
};

module.exports = nextConfig;
