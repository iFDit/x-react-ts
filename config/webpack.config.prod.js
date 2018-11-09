'use strict'
const path = require('path')
const paths = require('./paths')
const env = require('../config/env')
const loaders = require('./webpack.loaders')
const webpack = require('webpack')
// plugin
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const publicPath = '/'

// production configuration.
// compiles slowly and is focused on producing a fast and minimal bundle.
module.exports = {
  mode: 'production',
  // if error, fast quit.
  bail: true,
  // create source-map for production that it is easy to track bugs.
  // should not include the *.map files when publish.
  devtool: 'source-map',
  entry: [paths.appIndex],
  output: {
    // build folder.
    path: paths.appBuild,
    // can be generated with nested folders by using filename.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // support public path such as / or /my-project from homepage.
    publicPath: publicPath,
    // point sourcemap entries to original dist location.
    devtoolModuleFilenameTemplate: info => 
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // https://github.com/facebook/create-react-app/issues/2376
            // https://github.com/mishoo/UglifyJS2/issues/2011
            // https://github.com/facebook/create-react-app/issues/5250
            // https://github.com/terser-js/terser/issues/120
            comparisons: false,
            inline: 2,
          },
          mangle: {
            // safari 10 loop iterator bug "Cannot declare a let variable twice".
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // multi-process parallel running to improve the build speed.
        // default os.cpus().length - 1
        parallel: true,
        // enable file caching
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: {
            // sourcemap to be output into a separate file.
            inline: false,
            // help browser find the sourcemap.
            annotation: true,
          },
        },
      }),
    ],
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: true,
    },
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },
  resolve: {
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
    // 配置webpack解析模块时需要搜索的目录
    // 优先解析node_modules
    // 自动搜索src目录
    modules: ['node_modules', paths.appNodeModules].concat(paths.appSrc),
  },
  module: {
    // error if module isn't exports
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: loaders,
      }
    ]
  },
  plugins: [
    // Generates index.html file with <script> injected,
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: publicPath
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(js|css)$'
      ),
      threshold: 10240,
      minRatio: 0.8
    }),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // disabled notifies.
  performance: false,
}
