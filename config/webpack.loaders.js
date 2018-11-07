'use strict'

const paths = require('./paths')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

const isProduction = process.env.NODE_ENV === 'production'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

function getStyleLoader({ sass, modules } = {}) {
  const isSass = !!sass
  const isModules = !!modules

  const styleRegex = isSass ? /\.(scss|sass)$/ : /\.css$/
  const styleModuleRegex = isSass ? /\.module.(scss|sass)$/ : /\.module\.css$/
  const styleLoader = require.resolve('style-loader')
  const miniCSS = MiniCssExtractPlugin.loader
  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: isSass ? 2 : 1,
    },
  }
  const postCssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        })
      ],
      sourceMap: shouldUseSourceMap,
    }
  }

  const loaders = [
    isProduction ? miniCSS : styleLoader,
    cssLoader,
    postCssLoader,
  ]
  if (isSass) {
    loaders.push({
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: shouldUseSourceMap,
      }
    })
  }

  return {
    test: isModules ? styleModuleRegex : styleRegex,
    exclude: isModules ? '//' : styleModuleRegex,
    use: loaders,
  }
}

const threadLoader = {
  loader: require.resolve('thread-loader'),
  options: {
    // keep workers alive and lifting efficiency
    poolTimeout: isProduction ? 500 : Infinity
  }
}

const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: {
    babelrc: false,
    // use recommand presets for react
    presets: [require.resolve('@babel/preset-react')],
    cacheDirectory: true,
    cacheCompression: false,
  }
}

const tsLoader = {
  loader: require.resolve('ts-loader'),
  options: {
    // disable type checker
    transpileOnly: true,
    happyPackMode: true,
  }
}

module.exports = [
  {
    // url-loader 和 file-loader类似，对于limit < 10000的资源，url-loader可以将资源内嵌到html中，已避免额外的http请求
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
  // process js
  {
    test: /\.(js|jsx)$/,
    include: paths.appSrc,
    exclude: /[\\/]node_modules[\\/]/,
    use: [threadLoader, babelLoader],
  },
  // process ts
  {
    test: /\.tsx?$/,
    include: paths.appSrc,
    exclude: /[\\/]node_modules[\\/]/,
    use: [threadLoader, babelLoader, tsLoader]
  },
  // process css
  getStyleLoader(),
  getStyleLoader({ sass: true }),
  {
    test: /\.svg$/,
    exclude: /[\\/]node_modules[\\/]/,
    issuer: /\.(tsx?|jsx?)$/,
    use: [
      {
        loader: require.resolve('@svgr/webpack'),
        options: {
          titleProp: true,
        },
      },
    ],
  },
  // fallback to file loader to makes sure those assets get served by webpack
  // when you import an assets, you get its (virtual) filename
  // add new loader before file-loader!
  {
    exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/],
    loader: require.resolve('file-loader'),
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
]
