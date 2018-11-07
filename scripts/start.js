'use strict'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandleRejection', err => {
  throw err
})

const chalk = require('chalk')
const formatWebpackMessages = require('../utils/formatWebpackMessages')
const openBrowser = require('../utils/openBrowser')
const webpack = require('webpack')
const paths = require('../config/paths')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../config/webpack.config.dev')
const createDevServerConfig = require('../config/webpackDevServer.config')

const HOST = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 4001
let firstCompiler = true

function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

let compiler

try {
  compiler = webpack(config)
} catch (e) {
  console.log(chalk.red('Failed to compile.'))
  console.log(e)
  return
}
compiler.plugin('done', stats => {
  clearConsole()
  const messages = formatWebpackMessages(stats.toJson({}, true))
  const isSuccessful = !messages.errors.length && !messages.warnings.length
  if (isSuccessful) {
    console.log(chalk.green('Compiled successfully!'));
  }

  console.log(
    `  ${chalk.bold('Local:')}            http://localhost:${port}`
  )

  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1
    }
    console.log(chalk.red('Failed to compile.\n'))
    console.log(messages.errors.join('\n\n'))
    return
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'))
    console.log(messages.warnings.join('\n\n'))

    // Teach some ESLint tricks.
    console.log(
      '\nSearch for the ' +
        chalk.underline(chalk.yellow('keywords')) +
        ' to learn more about each warning.'
    );
    console.log(
      'To ignore, add ' +
        chalk.cyan('// eslint-disable-next-line') +
        ' to the line before.\n'
    )
  }
  if (firstCompiler) {
    openBrowser(`http://localhost:${port}`)
    firstCompiler = false
  }
})

const proxy = require(paths.appPackageJson).proxy
const serverConfig = createDevServerConfig(proxy)
const devServer = new WebpackDevServer(compiler, serverConfig)

devServer.listen(port, HOST, err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan('Starting the development server'))
  const signals = ['SIGINT', 'SI`GTERM']
  signals.forEach(sig => {
    process.on(sig, () => {
      devServer.close()
      process.exit()
    })
  })
})
