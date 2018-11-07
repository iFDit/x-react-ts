const path = require('path')
const fs = require('fs')

const dir = fs.realpathSync(process.cwd())
const resolvePath = pathname => path.resolve(dir, pathname)

module.exports = {
  appSrc: resolvePath('src'),
  appBuild: resolvePath('build'),
  appStatic: resolvePath('static'),
  appTsLint: resolvePath('tslint.json'),
  appIndex: resolvePath('src/index.tsx'),
  appTsConfig: resolvePath('tsconfig.json'),
  appHtml: resolvePath('public/index.html'),
  appNodeModules: resolvePath('node_modules'),
  appPackageJson: resolvePath('package.json'),
  appTsTestConfig: resolvePath('tsconfig.test.json'),
}
