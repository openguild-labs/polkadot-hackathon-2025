const { override, addWebpackPlugin, addWebpackAlias } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  
  addWebpackAlias({
    process: "process/browser",
    stream: "stream-browserify",
    zlib: "browserify-zlib"
  }),
  addWebpackPlugin(new webpack.ProvidePlugin({
    process: 'process/browser',
    Buffer: ['buffer', 'Buffer'],
  })),
  function(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      'process/browser': require.resolve('process/browser')
    }
    config.ignoreWarnings = [
      function ignoreSourcemapsloaderWarnings(warning) {
        return (
          warning.module &&
          warning.module.resource.includes('node_modules') &&
          warning.details &&
          warning.details.includes('source-map-loader')
        );
      },
    ];
    return config;
  }
);