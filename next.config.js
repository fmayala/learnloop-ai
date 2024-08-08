/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['kysely', 'kysely-prisma', '@prisma/client'],
    serverActions: {
      bodySizeLimit: '20mb',
    }
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
  }
};
