'use strict'

// const fs = require('fs')
// const chalk = require('chalk')
const paths = require('../config/paths')

function createJestConfig() {
  return {
    collectCoverageFrom: [
      'src/__test__/*.{js,jsx,ts,tsx}',
    ],
    setupFiles: [require.resolve('../config/polyfills.js')],
    testMatch: [
      "<rootDir>/src/**/__test__/**/*.(j|t)s?(x)",
      "<rootDir>/src/**/?(*.)(spec|test).(j|t)s?(x)"
    ],
    testEnvironment: 'node',
    // use for jsdom, such as location.href
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
      '^.+\\.tsx?$': require.resolve('ts-jest'),
      '^.+\\.css&': require.resolve('../config/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|css|json)$)': require.resolve('../config/jest/fileTransform.js')
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    globals: {
      'ts-jest': {
        tsConfigFile: paths.appTsTestConfig,
      }
    },
  }
}

module.exports = createJestConfig
