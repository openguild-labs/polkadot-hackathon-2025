module.exports = {
   module: {
      rules: [
         {
            test: /\.wasm$/,
            type: "webassembly/async", // Ensures async WebAssembly loading
         },
         {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
         },
      ],
   },
   // Existing configuration
   experiments: {
      asyncWebAssembly: true, // Enables WebAssembly support
   },
};
