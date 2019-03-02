const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')

const parts = require('./webpack.parts')

const paths = getPaths()


const cssPreprocessorLoader = { loader: 'fast-sass-loader' }

const commonConfig = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false
    },
    entry: `${paths.app}\\index.js`,
    output: {
      path: paths.build,
      publicPath: parts.publicPath
    },
    stats: {
      warningsFilter: warning => warning.includes('entrypoint size limit'),
      children: false,
      modules: false
    },
    plugins: [
      new HtmlPlugin({
        template: './index.pug'
      }),
      // тут добавляем новые страницы к сайту
   
      new FriendlyErrorsPlugin(),
      new webpack.ProvidePlugin({
        $: "jquery/dist/jquery.min.js",
    jQuery: "jquery/dist/jquery.min.js",
    "window.jQuery": "jquery/dist/jquery.min.js"
    }),
    ],
    module: {
      noParse: /\.min\.js/
    }
    
  },
  parts.loadPug(),
    parts.loadFonts({
    include: paths.app,
    options: {
      name: `${paths.fonts}/[name].[hash:8].[ext]`
    }
  })
])

const productionConfig = merge([
  {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: 'single'
    },
    output: {
      chunkFilename: `${paths.js}/[name].[chunkhash:8].js`,
      filename: `${paths.js}/[name].[chunkhash:8].js`
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 1000000,
      maxAssetSize: 4500000
    },
    plugins: [
      new StatsWriterPlugin({ fields: null, filename: '../stats.json' }),
      new webpack.HashedModuleIdsPlugin(),
      new ManifestPlugin(),
      new CleanPlugin(paths.build),
      new webpack.ProvidePlugin({
        $: "jquery/dist/jquery.min.js",
    jQuery: "jquery/dist/jquery.min.js",
    "window.jQuery": "jquery/dist/jquery.min.js"
    })
    ]
  },
  parts.minifyJS({
    terserOptions: {
      parse: {
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    },
    parallel: true,
    cache: true
  }),
  parts.loadJS({
    include: paths.app,
    options: {
      cacheDirectory: true
    }
  }),
  parts.extractCSS({
    include: paths.app,
    use: [parts.autoprefix(), cssPreprocessorLoader],
    options: {
      filename: `${paths.css}/[name].[contenthash:8].css`,
      chunkFilename: `${paths.css}/[id].[contenthash:8].css`
    }
  }),
  parts.purifyCSS({
    paths: glob.sync(`${paths.app}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss']
  }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      }
    }
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      limit: 15000,
      name: `${paths.images}/[name].[hash:8].[ext]`
    }
  }),
  parts.optimizeImages()
])

const developmentConfig = merge([
  {
    mode: 'development'
  },
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS({ include: paths.app, use: [cssPreprocessorLoader] }),
  parts.loadImages({ include: paths.app }),
  parts.loadJS({ include: paths.app })
])

module.exports = env => {
  process.env.NODE_ENV = env
  
  return merge(
    commonConfig,
    env === 'production' ? productionConfig : developmentConfig
  )
}

function getPaths ({
  sourceDir = 'app',
  buildDir = 'build',
  staticDir = '',
  images = 'images',
  fonts = 'fonts',
  js = 'scripts',
  css = 'styles'
} = {}) {
  const assets = { images, fonts, js, css }

  return Object.keys(assets).reduce((obj, assetName) => {
    const assetPath = assets[assetName]

    obj[assetName] = !staticDir ? assetPath : `${staticDir}/${assetPath}`

    return obj
  }, {
    app: path.join(__dirname, sourceDir),
    build: path.join(__dirname, buildDir),
    staticDir
  })
}
