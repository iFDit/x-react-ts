'use strict'
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')

process.on('unhandleRejection', err => {
  throw err
})

const scoped = process.argv.slice(2)[0]

const appPath = process.cwd()
const ownPath = path.join(appPath, 'node_modules', 'x-react-ts')
const reactTsExist = fs.existsSync(ownPath)

if (!reactTsExist) {
  console.error(`react-ts not found, please install react-ts first.`)
  return
}

if (!fs.existsSync(path.join(appPath, 'package.json'))) {
  spawn.sync('npm', ['init', '--yes'])
}
const appPackage = require(path.join(appPath, 'package.json'))
appPackage.dependencies = appPackage.dependencies || {}

appPackage.scripts = {
  start: 'react-ts start',
  'build:lib': 'tsc',
  'build:web': 'react-ts build:web',
  test: 'react-ts test --env=jsdom',
}

if (scoped) {
  appPackage.name = `@${scoped}/my-app`
}

appPackage.main = 'lib/index'
appPackage.typings = 'lib/index.d.ts'

fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2))

const templatePath = path.join(ownPath, 'template')

if (fs.existsSync(ownPath)) {
  fs.copySync(templatePath, appPath)
} else {
  return
}

const types = [
  '@types/node',
  '@types/react',
  '@types/react-dom',
  '@types/jest',
  '@types/sinon',
  '@types/enzyme',
  '@types/enzyme-adapter-react-16',
  'typescript',
]

console.log( `Installing ${types.join(', ')} as dev dependencies npm...`)

const args = ['install', '--save']

const child = spawn.sync('npm', args.concat('-D').concat(types), { stdio: 'inherit' })

if (child.status !== 0) {
  console.error('install failed')
  return
}

if (!isReactInstalled(appPackage)) {
  console.log('Install react and react-dom')

  const c = spawn.sync('npm', args.concat(['react', 'react-dom']), { stdio: 'inherit' })

  if (c.status !== 0) {
    console.error(`npm install ${args.join(' ')} failed`)
    return
  }
}

console.log('success')

function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {};

  return typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined';
}
