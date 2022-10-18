const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { ExpoHtmlWebpackPlugin } = require('@expo/webpack-config/plugins/index')
const nodeHtmlParser = require("node-html-parser")
const fsExtra = require("fs-extra")
const expoEnv = require('@expo/webpack-config/env')
class HtmlWebpackPlugin extends ExpoHtmlWebpackPlugin {
  generatedScriptTags() {
    return super.generatedScriptTags(['app.js']);
  }
}

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

  const locations = env.locations || (await (0, expoEnv.getPathsAsync)(env.projectRoot))
  const templateIndex = (0, nodeHtmlParser.parse)((0, fsExtra.readFileSync)(locations.template.indexHtml, { encoding: 'utf8' }))

  // if it's a web build
  if (process.env.WEB_ENGINE) {
    // Alias the 'react-native-webview' package, in order to add support
    // (web implementation) of React Native's WebView. See:
    // {@link https://github.com/react-native-web-community/react-native-web-webview}
    config.resolve.alias['react-native-webview'] = 'react-native-web-webview'

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
    const excludeHtmlWebpackPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin'
    )
    if (excludeHtmlWebpackPlugin !== -1) {
      config.plugins.splice(excludeHtmlWebpackPlugin, 1)
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

    if (config.mode === 'production') {
      config.entry = {
        ...config.entry,
        ...entries
      }
    }

    config.plugins = [
      ...config.plugins,
      // Overrides ExpoCopyPlugin
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
      }),
      // Overrides ExpoHtmlWebpackPlugin
      new HtmlWebpackPlugin(env, templateIndex)
    ]

    // Disables chunking, minimization, and other optimizations that alter the default transpilation of the extension services files.
    config.optimization = {}

    config.output = {
      // possible output paths: /webkit-dev, /gecko-dev, /webkit-prod, gecko-prod
      path: path.resolve(__dirname, `${process.env.WEBPACK_BUILD_OUTPUT_PATH}`)
    }
  }

  return config
}
