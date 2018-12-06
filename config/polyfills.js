'use strict'

if (!Promise) {
  window.Promise = require('promise/lib/es6-extensions.js')
}

require('whatwg-fetch')

// React require
Object.assign = require('object-assign')

// jsdom require
if (process.env.NODE_ENV === 'test') {
  const Enzyme = require('enzyme')
  const Adapter = require('enzyme-adapter-react-16')
  require('raf').polyfill(global)
  Enzyme.configure({ adapter: new Adapter() })
}
