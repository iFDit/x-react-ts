
const raw = Object.keys(process.env)
  .filter(key => /^REACT_/i.test(key))
  .reduce((env, key) => {
    env[key] = process.env[key]
    return env
  }, {
    NODE_ENV: process.env.NODE_ENV || 'development',
  })

const stringified = {
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key])
    return env
  }, {}),
}

module.exports = {
  stringified
}
