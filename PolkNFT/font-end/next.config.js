/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
   sassOptions: {
      includePaths: [path.join(__dirname, "styles")],
   },
};

module.exports = nextConfig;

module.exports = {
   // webpack(config) {
   //    config.module.rules.push({
   //       test: /\.svg$/i,
   //       issuer: /\.[jt]sx?$/,
   //       use: ["@svgr/webpack"],
   //    });

   //    config.experiments = {
   //       ...config.experiments,
   //       asyncWebAssembly: true, // Enable async WebAssembly
   //    };
   //    return config;
   // },

   webpack: (config) => {
      config.experiments = {
         ...config.experiments,
         asyncWebAssembly: true, // Enable async WebAssembly
      };
      return config;
   },
};
