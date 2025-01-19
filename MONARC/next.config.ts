// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'violet-defiant-kite-65.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      // Add gateway.pinata.cloud as well for redundancy
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      // Add ipfs.io gateway as fallback
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
    // Optional: Set default image sizes for optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optional: Adjust image optimizer if needed
  // images: {
  //   minimumCacheTTL: 60,
  // },
};

module.exports = nextConfig;