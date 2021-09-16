const { merge } = require('webpack-merge');
const webpack = require('webpack'); 
const common = require('./webpack.common');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const Dotenv = require("dotenv-webpack");
require('dotenv').config({
  path: './.env.development'
});
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
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          REACT_APP_IMAGE_PATH: JSON.stringify(process.env.REACT_APP_IMAGE_PATH),
          REACT_APP_AWS_REGION: JSON.stringify(process.env.REACT_APP_AWS_REGION),
          REACT_APP_S3_BUCKET_NAME: JSON.stringify(process.env.REACT_APP_S3_BUCKET_NAME),
          REACT_APP_CONTENTS_PASSWORD: JSON.stringify(process.env.REACT_APP_CONTENTS_PASSWORD),
          REACT_APP_FACEBOOK_APP_ID: JSON.stringify(process.env.REACT_APP_FACEBOOK_APP_ID),
          REACT_APP_FACEBOOK_TEST_APP_ID: JSON.stringify(process.env.REACT_APP_FACEBOOK_TEST_APP_ID),
          REACT_APP_GOOGLE_AUTH_CLIENT_ID: JSON.stringify(process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID),
          REACT_APP_HIDDEN_KEY: JSON.stringify(process.env.REACT_APP_HIDDEN_KEY),
          REACT_APP_AWS_ACCESS_KEY_ID: JSON.stringify(process.env.REACT_APP_AWS_ACCESS_KEY_ID),
          REACT_APP_AWS_SECRET_ACCESS_KEY: JSON.stringify(process.env.REACT_APP_AWS_SECRET_ACCESS_KEY),
        },
      }),
      new webpack.EnvironmentPlugin(),
 
      new BundleAnalyzerPlugin({
        // analyzerPort: 8000,
        // analyzerHost: 'localhost',
        analyzerMode: "static",
        openAnalyzer: false 
      }),
      new webpack.HotModuleReplacementPlugin(),
  ],
})