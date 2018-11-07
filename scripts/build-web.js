'use strict'

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

process.on('unhandledRejection', err => {
  throw err
})

const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config/webpack.config.prod')
const formatWebpackMessages = require('../utils/formatWebpackMessages')

function build() {
  console.log('running production build..')
  const compiler = webpack(config)
  compiler.run((error, stats) => {
    if (error) {
      return err
    }
    const messages = formatWebpackMessages(stats.toJson({}, true))
    messages.errors = messages.errors.slice(0, 1)
    if (messages.errors.length > 0) {
      console.log(chalk.red('Failed to compile.\n'))
      try {
        const matched = /(.+)\[(.+):(.+),(.+)\]\[.+\]/.exec(stack)
        if (!matched) {
          throw new Error('Using errors for control flow is bad.')
        }
        const problemPath = matched[2]
        const line = matched[3]
        const column = matched[4]
        console.log(
          'Failed to minify the code from this file: \n\n',
          chalk.yellow(
            `\t${problemPath}:${line}${column !== '0' ? ':' + column : ''}`
          ),
          '\n'
        )
      } catch (ignored) {
        console.log('Failed to minify the bundle.', messages.errors)
      }
      console.log('Read more here: http://bit.ly/2tRViJ9')
      process.exit(1)
    }
    console.log(chalk.green('Compiled successfully.\n'))
  })
}

build()
