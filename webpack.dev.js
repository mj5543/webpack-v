const { merge } = require('webpack-merge');
const webpack = require('webpack'); 
const common = require('./webpack.common');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require("dotenv-webpack");

console.log('process.env dev::::::: ', process.env);

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      compress: true,
      hot : true,
      historyApiFallback: true,
      port: 3000,
      open : true,
      proxy: {
        "/api/*": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
 
    plugins: [
      new Dotenv({
        path: './.env.development'
      }),
      new BundleAnalyzerPlugin({
        // analyzerPort: 8000,
        // analyzerHost: 'localhost',
        analyzerMode: "static",
        openAnalyzer: false 
      }),
      new webpack.HotModuleReplacementPlugin(),
  ],
})