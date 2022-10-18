const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { ExpoHtmlWebpackPlugin } = require('@expo/webpack-config/plugins/index')
const nodeHtmlParser = require("node-html-parser")
const fsExtra = require("fs-extra")
const expoEnv = require('@expo/webpack-config/env')

// Overrides the default generatedScriptTags
// generatedScriptTags is used to add the entry files as scripts in index.html
// but we heed only the app.js entry because the other entries are extension services running as background processes in the browser
class HtmlWebpackPlugin extends ExpoHtmlWebpackPlugin {
  generatedScriptTags() {
    return super.generatedScriptTags(['app.js']);
  }
}

module.exports = async function (env, argv) {
  // manifest.json output file for WEB_ENGINE: GECKO
  function processManifestGecko(content) {
    const manifest = JSON.parse(content.toString())
    manifest.manifest_version = 2
    manifest.background = {
      scripts: ['background.js']
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

  // style.css output file for WEB_ENGINE: GECKO
  function processStyleGecko(content) {
    let style = content.toString()
    // Firefox extensions max window height is 600px
    style = style.replace('min-height: 730px;', 'min-height: 600px;')

    return style
  }

  // Additional entries from /web (extension services)
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

  // Customize webpack only for web
  if (process.env.WEB_ENGINE) {
    // Alias the 'react-native-webview' package, in order to add support
    // (web implementation) of React Native's WebView. See:
    // {@link https://github.com/react-native-web-community/react-native-web-webview}
    config.resolve.alias['react-native-webview'] = 'react-native-web-webview'

    // The files in the /web directory should be transpiled not just copied
    const excludeCopyPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'CopyPlugin'
    )
    if (excludeCopyPlugin !== -1) {
      config.plugins.splice(excludeCopyPlugin, 1)
    }
    // Not needed because output directory cleanup is handled in the run script
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
    // Not needed because a custom manifest.json transpilation is implemented below
    const excludeExpoPwaManifestWebpackPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'ExpoPwaManifestWebpackPlugin'
    )
    if (excludeExpoPwaManifestWebpackPlugin !== -1) {
      config.plugins.splice(excludeExpoPwaManifestWebpackPlugin, 1)
    }

    if (config.mode === 'development') {
      // By removing this plugin and overriding the devServer obj the default dev server config will be used in dev mode
      const excludeHotModuleReplacementPlugin = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === 'HotModuleReplacementPlugin'
      )
      if (excludeHotModuleReplacementPlugin !== -1) {
        config.plugins.splice(excludeHotModuleReplacementPlugin, 1)
      }

      // Use default webpack devServer config
      config.devServer = {}
      // writeToDisk: output dev bundled files (in /webkit-dev or /gecko-dev) to import them as unpacked extension in the browser
      config.devServer.writeToDisk = true
    }

      config.entry = {
        // Default entries
        ...config.entry,
        // Our custom extension specific entries
        ...entries
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
