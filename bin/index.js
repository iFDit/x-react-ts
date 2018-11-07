#!/usr/bin/env node

'use strict'

const spawn = require('cross-spawn')
const args = process.argv.slice(2)
const commands = ['start', 'init', 'build:web', 'test']
const commandIndex = args.findIndex(x => commands.includes(x))
const command = commandIndex > 0 ? args[commandIndex] : args[0]
const restArgs = commandIndex > -1 ? args.slice(commandIndex + 1) : []

if (commands.includes(command)) {
  const cmd = command.split(':').join('-')
  const result = spawn.sync('node', [require.resolve(`../scripts/${cmd}`)].concat(restArgs), { stdio: 'inherit' })
  if (result.signal) {
    const failedText = 'react-ts start failed because the process exited too early.'
    if (result.signal === 'SIGKILL') {
      console.log(`
        ${failedText}
      `)
    }
    if (result.signal === 'SIGTERM') {
      console.log(`
        ${failedText}
      `)
    }
    process.exit(1)
  }
  process.exit(result.status)
} else {
  console.log(`Unknown command ${command}.`)
}
