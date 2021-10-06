const path = require("path");
const {merge} = require('webpack-merge');
const webpack = require('webpack'); 
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const PORT = process.env.PORT || 5000;
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CssnanoPlugin = require('cssnano-webpack-plugin');
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const XMLWebpackPlugin = require('xml-webpack-plugin');
const xmlFiles = [
  {
      template: './public/sitemap.xml',
      filename: 'sitemap.xml',
  }
]

require('dotenv').config();

module.exports = merge(common, {
    mode: 'production',
    optimization : {
        minimize: true,
        moduleIds: 'deterministic',
        minimizer: [
          new CssnanoPlugin({
            cssnanoOptions: {
              preset: ['default', {
                discardComments: { removeAll: true }
              }]
            }
          }),
          new TerserPlugin({
            test: /\.m?js(\?.*)?$/i,
            terserOptions: {
              compress: {
               drop_console: true, // 콘솔 로그를 제거한다 
             }
           }
          }),
        ],
        runtimeChunk: {
          name: "runtime"
        },
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              // name(module, chunks, cacheGroupKey) {
              //   const moduleFileName = module
              //     .identifier()
              //     .split('/')
              //     .reduceRight((item) => item);
              //   const allChunksNames = chunks.map((item) => item.name).join('~');
              //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              // },
              // chunks: 'initial'
              chunks: 'all'
            },
            styles: {
              name: "styles",
              type: "css/mini-extract",
              chunks: "all",
              enforce: true,
            },
            // icons: {
            //   chunks: 'all',
            //   name: 'emoji',
            //   test: /src\/js\/components\/ui\/emoji/,
            //   enforce: true,
            // },
          }
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
        new GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /asset-manifest\.json$/],
          // importWorkboxFrom: 'cdn',
          navigateFallback: './public/index.html',
          navigateFallbackAllowlist: [
            // Exclude URLs starting with /_, as they're likely an API call
            new RegExp('^/_'),
            // Exclude URLs containing a dot, as they're likely a resource in
            // public/ and not a SPA route
            new RegExp('/[^/]+\\.[^/]+$'),
          ],
        }),
        // new CompressionPlugin(),
        new CompressionPlugin({
          // filename(pathData) {
          //   // The `pathData` argument contains all placeholders - `path`/`name`/`ext`/etc
          //   // Available properties described above, for the `String` notation
          //   if (/\.svg$/.test(pathData.filename)) {
          //     return "assets/svg/[path][base].gz";
          //   }
    
          //   return "assets/js/[path][base].gz";
          // },
          algorithm: "gzip",
          test: /\.js$|\.css$|\.html$|\.svg$/,
          // test: /\.(js|html)$/,
          threshold: 10240, // 10kb
          minRatio: 0.8
        }),
        // new InjectManifest({
        //   swSrc: './dist/service-worker.js',
        //   swDest: 'service-worker.js',
        // }),
        // new GenerateSW(),
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: true 
        }),
        new XMLWebpackPlugin({
          files: xmlFiles
      })
    ],
      
})