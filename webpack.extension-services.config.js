/* eslint-disable import/no-extraneous-dependencies */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = async function (env, argv) {
  // files to pass in classic webpack
  const entries = {
    background: './web/services/background.js',
    'content-script': './web/services/content-script.js',
    'content-script-onComplete': './web/services/content-script-onComplete.js',
    'page-context': './web/services/page-context.js',
    injection: './web/services/injection.js'
  }

  function processManifestGecko(content) {
    const manifest = JSON.parse(content.toString())
    manifest.manifest_version = 2
    manifest.background = {
      scripts: ['services/background.js']
    }
    manifest.web_accessible_resources = ['*']
    manifest.host_permissions = undefined
    manifest.browser_action = JSON.parse(JSON.stringify(manifest.action))
    delete manifest.action
    manifest.externally_connectable = undefined
    manifest.permissions.splice(manifest.permissions.indexOf('scripting'), 1)
    manifest.permissions.push('<all_urls>')

    const manifestJSON = JSON.stringify(manifest, null, 2)
    return manifestJSON
  }

  function processStyleGecko(content) {
    let style = content.toString()
    style = style.replace('min-height: 730px;', 'min-height: 600px;')

    return style
  }

  const getPlugins = () => {
    return [
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        'process.env.WEB_ENGINE': process.env.WEB_ENGINE
      }),
      new CopyPlugin({
        patterns: [
          {
            from: './web/assets',
            to: '../assets'
          },
          {
            from: './web/constants',
            to: '../constants'
          },
          { from: './web/services/ambexMessanger.js', to: './ambexMessanger.js' },
          {
            from: './web/style.css',
            to: '../style.css',
            transform(content) {
              if (process.env.WEB_ENGINE === 'gecko') {
                return processStyleGecko(content)
              }

              return content
            }
          },
          {
            from: './web/manifest.json',
            to: '../manifest.json',
            transform(content) {
              if (process.env.WEB_ENGINE === 'gecko') {
                return processManifestGecko(content)
              }

              return content
            }
          }
        ]
      })
    ]
  }

  const webpackModule = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }

  const commonConfig = {
    entry: entries,
    module: webpackModule,
    devtool: argv.mode === 'development' ? 'cheap-module-source-map' : 'source-map',
    devServer: {
      writeToDisk: true
    },
    resolve: {
      extensions: ['.js', '.ts']
    }
  }

  const chromeServicesConfig = {
    ...commonConfig,
    plugins: getPlugins(),
    output: {
      path: path.resolve(__dirname, 'web-build/services')
    }
  }

  return chromeServicesConfig
}
