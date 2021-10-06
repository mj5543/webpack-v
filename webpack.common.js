const path = require("path");
const webpack = require('webpack'); 
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
// const TerserPlugin =  require('terser-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const os = require('os');
module.exports = {
  entry: {
    main : './src/index.js',
    // posts: './src/pages/Posts.js',
    // vendor: ["moment", "lodash", "react-bootstrap"]
  },
  output: {
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname + "/dist")
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "fs": false,
    }
  },
  stats: {
    children: true,
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules/",
        use: ['babel-loader'],
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: [
        //       '@babel/preset-env',
        //       "@babel/preset-react"
        //     ],
        //     plugins: [
        //       "@babel/plugin-transform-runtime",
        //       "@babel/plugin-syntax-dynamic-import",
        //       ["transform-remove-console", { "exclude": [ "error"] }]
        //     ],
        //   }
        // }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      // {
      //   test: /\.(sa|sc|c)ss$/,
      //   use: [
      //     devMode ? "style-loader" : MiniCssExtractPlugin.loader,
      //     "css-loader",
      //     "postcss-loader",
      //     "sass-loader",
      //   ],
      // },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { sourceMap: true }}]
      // },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader']
      // },
      // {
      //   test: /\.scss$/,
      //   use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      // },
      
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader",
        {
          loader: "sass-loader",
          options: {
            // Prefer `dart-sass`
            implementation: require("sass"),
          },
        },
      ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]']
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          name: '[hash].[ext]',
          limit: 10000,
        },
      },
      // SVG 로더
      {
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.xml$/,
        use: {
          loader: 'xml-loader',
          options: {
            explicitArray: false,
          },
        },
      },
    ]
  },
  // externals: {
  //   express: 'express',
  // },
  // externals: {
  //   // Don't bundle the 'react' npm package with the component.
  //   'react': 'React' 
  // },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(),
    new HtmlWebPackPlugin({
      template: './public/index.html', // public/index.html 파일을 읽는다.
      filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
      favicon: './public/favicon.ico'
    }),
    // new HtmlWebPackPlugin({
    //   filename: "posts.html",
    //   excludeChunks: ["main"],
    //   template: path.resolve("public/posts.html"),
    // }),
    // new HtmlWebPackPlugin({
    //   excludeChunks: ["posts"],
    //   template: path.resolve("public/index.html"),
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
      ignoreOrder: true,
    }),
    // new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    new NodePolyfillPlugin({
      excludeAliases: ["console"]
    }),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/'
    }),
  ]
};