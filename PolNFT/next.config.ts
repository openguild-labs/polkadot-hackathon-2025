import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    LEND_CONTRACT_ADDRESS: process.env.LEND_CONTRACT_ADDRESS,
    RENT_CONTRACT_ADDRESS: process.env.RENT_CONTRACT_ADDRESS,
    FEE_TOKEN_ADDRESS: process.env.FEE_TOKEN_ADDRESS,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
