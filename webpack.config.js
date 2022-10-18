const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = async function (env, argv) {
  // manifest.json file for WEB_ENGINE: GECKO
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

  // style.css file for WEB_ENGINE: GECKO
  function processStyleGecko(content) {
    let style = content.toString()
    style = style.replace('min-height: 730px;', 'min-height: 600px;')

    return style
  }

  // Additional entries (extension services)
  const entries = {
    background: './web/services/background.js',
    'content-script': './web/services/content-script.js',
    'content-script-onComplete': './web/services/content-script-onComplete.js',
    'page-context': './web/services/page-context.js',
    injection: './web/services/injection.js'
  }

  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['ambire-common'] }
    },
    argv
  )

  // if it's a web build
  if (process.env.WEB_ENGINE) {
    // Alias the 'react-native-webview' package, in order to add support
    // (web implementation) of React Native's WebView. See:
    // {@link https://github.com/react-native-web-community/react-native-web-webview}
    config.resolve.alias['react-native-webview'] = 'react-native-web-webview'

    if (config.mode === 'production') {
      // No need to copy the extension services files from the /web folder because
      // the services files are transpiled by webpack.extension-services.config.js
      const excludeCopyPlugin = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === 'CopyPlugin'
      )
      if (excludeCopyPlugin !== -1) {
        config.plugins.splice(excludeCopyPlugin, 1)
      }
      // Excluded because CleanWebpackPlugin interferes with the files creation of webpack.extension-services.config.js
      const excludeCleanWebpackPlugin = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === 'CleanWebpackPlugin'
      )
      if (excludeCleanWebpackPlugin !== -1) {
        config.plugins.splice(excludeCleanWebpackPlugin, 1)
      }
    }

    // Manifest transpilation handled in the custom CopyPlugin below
    const excludeExpoPwaManifestWebpackPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'ExpoPwaManifestWebpackPlugin'
    )
    if (excludeExpoPwaManifestWebpackPlugin !== -1) {
      config.plugins.splice(excludeExpoPwaManifestWebpackPlugin, 1)
    }
    // Needed for loading the dev files as browser extension in dev mode
    // Because extensions doesn't have access to the dev server
    if (config.mode === 'development') {
      config.devServer.writeToDisk = true
    }
  }

  config.entry = {
    ...config.entry,
    ...entries
  }

  config.plugins = [
    ...config.plugins,
    new CopyPlugin({
      patterns: [
        {
          from: './web/assets',
          to: 'assets'
        },
        {
          from: './web/constants',
          to: 'constants'
        },
        { from: './web/services/ambexMessanger.js', to: './ambexMessanger.js' },
        {
          from: './web/style.css',
          to: 'style.css',
          transform(content) {
            if (process.env.WEB_ENGINE === 'gecko') {
              return processStyleGecko(content)
            }

            return content
          }
        },
        {
          from: './web/manifest.json',
          to: 'manifest.json',
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

  config.output = {
    // possible output paths: /webkit-dev, /gecko-dev, /webkit-prod, gecko-prod
    path: path.resolve(__dirname, `${process.env.WEBPACK_BUILD_OUTPUT_PATH}`)
  }

  return config
}
