const formatWebpackMessages = require('./formatWebpackMessages')
const Sockjs = require('sockjs-client')
const url = require('url')

const connection = new Sockjs(
  url.format({
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    pathname: '/sockjs-node',
  })
)

connection.onclose = function () {
  if (console && console.info) {
    console.info('The server has disconnected. \nRefresh the page to reconnect')
  }
}

connection.onmessage = function (e) {
  const message = JSON.parse(e.data)
  switch (message.type) {
    case 'hash':
      saveCurrentHash(message.data)
      break
    case 'still-ok':
    case 'ok':
      handleSuccess()
      break
    case 'content-changed':
      window.location.reload()
      break
    case 'warnings':
      handleWarnings(message.data)
      break
    case 'errors':
      handleErrors(message.data)
      break
    default:
      // nothing to do
  }
}

let firstCompilation = true
let recentHash = null

function saveCurrentHash(hash) {
  recentHash = hash
}

function handleSuccess() {
  let isHotUpdate = !firstCompilation
  firstCompilation = false

  if (isHotUpdate) {
    applyUpdate()
  }
}

function handleWarnings(warnings) {
  let isHotUpdate = !firstCompilation
  firstCompilation = false

  if (isHotUpdate) {
    const data = formatWebpackMessages({
      warnings,
      errors: []
    })

    if (console && console.warn) {
      data.warnings.forEach(warn => console.warn(warn))
    }
  }
}

function handleErrors(errors) {
  let isHotUpdate = !firstCompilation
  firstCompilation = false

  if (isHotUpdate) {
    const data = formatWebpackMessages({
      warnings: [],
      errors,
    })

    if (console && console.error) {
      data.errors.forEach(err => console.error(err))
    }
  }
}

function applyUpdate() {
  if (!module.hot) {
    // not HotModuleReplacementPlugin in Webpack
    window.location.reload()
    return
  }

  if (!shouldUpdate()) {
    return
  }

  // not hot replacement
  window.location.reload()
}

function shouldUpdate() {
  // __webpack_hash__ is global variable injected by Webpack
  // it is the hash of the current compilation
  return recentHash !== __webpack_hash__
}
