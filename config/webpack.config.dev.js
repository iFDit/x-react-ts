'use strict'

const path = require('path')
const env = require('./env')
const paths = require('./paths')
const webpack = require('webpack')
const loaders = require('./webpack.loaders')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

/**
 * 开发配置，优化开发体验和重构建速度。
 */
const publicPath = '/'
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('./polyfills'),
    // require.resolve('webpack-dev-server/client') + '?http://localhost:4001',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('../utils/hotDevClient'),
    paths.appIndex,
  ],
  output: {
    // webpack require 添加 /* filename */
    pathinfo: true,
    // run time virtual path that is served by webpackDevServer
    filename: 'static/js/bundle.js',
    // 开启code splitting时产生的代码块
    chunkFilename: 'static/js/[name].chunk.js',
    // resource is served from
    publicPath: publicPath,
    // ??windows?指定source map在本地磁盘的位置
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  resolve: {
    // 对模块引入自动解析的文件扩展
    // 能够在引入文件时候不写扩展名
    // 引入js/jsx来支持第三方工具
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
    plugins: [
      // enhanced-resolve plugins, don't know.
    ],
  },
  module: {
    // error if module isn't exports
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        // test, include, exclude and resource are match resource
        test: /\.(js|jsx)$/, 
        loader: require.resolve('source-map-loader'),
        enforce: 'pre',
        // 只从src/中匹配
        include: paths.appSrc,
      },
      {
        // switch one of loader
        oneOf: loaders,
      },
    ]
  },
  plugins: [
    // make sure env variables available in index.html
    // like %PUBLIC_URL%
    // new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // useful in browser profiler
    new webpack.NamedModulesPlugin(),
    // make sure env variables available in js code.
    new webpack.DefinePlugin(env.stringified),
    // emit hot updates(css only)
    new webpack.HotModuleReplacementPlugin(),
    // add new module without restart webpack
    // new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // use moment.js and prevent to import too much locale files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // type checking in a separate process to speed up compilation
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    })
  ],
  // make sure some node module can import at browser
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // disable performance warning in development
  performance: {
    hints: false,
  },
}
