'use strict'

const config = require('./webpack.config.dev')
const paths = require('./paths')
const path = require('path')

function ignoredFiles() {
  return new RegExp(
    `^(?!${escape(
      path.normalize(paths.appSrc + '/').replace(/[\\]+/g, '/')
    )}).+/node_modules/`,
    'g'
  )
}

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

module.exports = function(proxy) {
  return {
    // Enable gzip
    compress: true,
    // slience webpackDevServer logs
    clientLogLevel: 'none',
    contentBase: paths.appStatic,
    // auto page reload
    watchContentBase: true,
    // only css will hot reload, js change will refresh the browser
    hot: true,
    // use url root path for webpackDevServer
    publicPath: config.output.publicPath,
    // make webpackDevServer quiet
    quiet: true,
    // avoids CPU overload
    watchOptions: {
      ignored: ignoredFiles()
    },
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy,
  }
}
