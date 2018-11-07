'use strict'

// set env
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''

const jest = require('jest')
const createJestConfig = require('../utils/createJestConfig')

let argv = process.argv.slice(2)

// watch unless on CI, coverage mode or explicitly running all tests
if (!process.env.CI && argv.indexOf('--coverage') === -1 && argv.indexOf('--watchAll') == -1) {
  argv.push('--watchAll')
}

argv.push(
  '--config',
  JSON.stringify(createJestConfig())
)

jest.run(argv)
