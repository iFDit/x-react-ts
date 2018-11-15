const opn = require('opn')

function openBrowser(url) {
  try {
    opn(url).catch(() => {/*prevent `unhandleRejection` error.*/})
    return true
  } catch (err) {
    return false
  }
}

module.exports = openBrowser
