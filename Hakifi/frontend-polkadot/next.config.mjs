const IS_OUTPUT_STANDALONE = process.env.IS_OUTPUT_STANDALONE === "1";
import * as path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    fiber: false,
    includePaths: [path.dirname('styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sgp1.digitaloceanspaces.com",
        pathname: "/nami-dev/**",
      },
      {
        protocol: "https",
        hostname: "sgp1.digitaloceanspaces.com",
        pathname: "/static.nami/nami.exchange/images/coins/64/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/thumb/0/01/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "lh7-us.googleusercontent.com",
        // pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "blog.vnst.io",
        pathname: "/content/images/**",
      },
      {
        protocol: "https",
        hostname: "blog.hakifi.io",
        pathname: "/content/**",
      },
      {
        protocol: "https",
        hostname: "cdn.martianwallet.xyz",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "spacecywallet.com",
      },
    ],
    // domains: ['https://']
  },
  reactStrictMode: false,
};

if (IS_OUTPUT_STANDALONE) {
  nextConfig.output = "standalone";
}

export default nextConfig;
