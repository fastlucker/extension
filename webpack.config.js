/* eslint-disable no-restricted-syntax */
// The 'react-native-dotenv' package doesn't work in the NodeJS context (and
// with commonjs imports), so alternatively, use 'dotend' package to load the
// environment variables from the .env file.
require('dotenv').config()

const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const fs = require('fs')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { ExpoHtmlWebpackPlugin } = require('@expo/webpack-config/plugins/index')
const expoEnv = require('@expo/webpack-config/env')
// Ignore adding the following packages to the dependencies list,
// because they are already included in the expo package deps.
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeHtmlParser = require('node-html-parser')
// eslint-disable-next-line import/no-extraneous-dependencies
const fsExtra = require('fs-extra')
const webpack = require('webpack')
const appJSON = require('./app.json')

// Overrides the default generatedScriptTags
// generatedScriptTags is used to add the entry files as scripts in index.html
// but we heed only the app.js entry because the other entries are extension services running as background processes in the browser
class HtmlWebpackPlugin extends ExpoHtmlWebpackPlugin {
  generatedScriptTags() {
    return super.generatedScriptTags(['app.js'])
  }
}

module.exports = async function (env, argv) {
  function processManifest(content) {
    const manifest = JSON.parse(content.toString())
    // Temporarily the manifest is v2 for all browsers until the v3 is ready for prod and tested well
    const manifestVersion = 2

    // Maintain the same versioning between the web extension and the mobile app
    manifest.version = appJSON.expo.version

    // Directives to disallow a set of script-related privileges for a
    // specific page. They prevent the browser extension being embedded or
    // loaded as an <iframe /> in a potentially malicious website(s).
    //   1. The "script-src" directive specifies valid sources for JavaScript.
    //   This includes not only URLs loaded directly into <script> elements,
    //   but also things like inline script event handlers (onclick) and XSLT
    //   stylesheets which can trigger script execution. Must include at least
    //   the 'self' keyword and may only contain secure sources.
    //   2. The "object-src" directive may be required in some browsers that
    //   support obsolete plugins and should be set to a secure source such as
    //   'none' when needed. This may be necessary for browsers up until 2022.
    //   3. The "frame-ancestors" directive specifies valid parents that may
    //   embed a page using <frame>, <iframe>, <object>, <embed>, or <applet>.
    // {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources}
    // {@link https://web.dev/csp/}
    const csp = "script-src 'self'; object-src 'self'; frame-ancestors 'none';"

    if (manifestVersion === 3) {
      manifest.content_security_policy = { extension_pages: csp }
      // This value can be used to control the unique ID of an extension,
      // when it is loaded during development. In prod, the ID is generated
      // in Chrome Web Store and can't be changed.
      // {@link https://developer.chrome.com/extensions/manifest/key}
      // TODO: Figure out if this works for gecko
      manifest.key = process.env.BROWSER_EXTENSION_PUBLIC_KEY
    }

    // Tweak manifest file, so it's compatible with gecko extensions specifics
    if (manifestVersion === 2) {
      manifest.manifest_version = 2
      manifest.background = {
        scripts: ['browser-polyfill.js', 'background.js'],
        persistent: true
      }
      manifest.browser_specific_settings = {
        gecko: {
          id: 'webextension@ambire.com',
          strict_min_version: '68.0'
        }
      }
      manifest.web_accessible_resources = ['*']
      manifest.host_permissions = undefined
      manifest.browser_action = JSON.parse(JSON.stringify(manifest.action))
      delete manifest.action
      manifest.externally_connectable = undefined
      manifest.permissions.push('<all_urls>')
      // manifest.content_security_policy = csp
    }

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

  const entries = {}

  const addEntriesFromDirectory = (directory) => {
    const filesInDirectory = fs.readdirSync(directory)
    for (const file of filesInDirectory) {
      const absolute = path.join(directory, file)
      if (fs.statSync(absolute).isDirectory()) {
        addEntriesFromDirectory(absolute)
      } else if (absolute.endsWith('.ts')) {
        entries[path.parse(absolute).name] = `./${absolute.slice(0, -3)}`
      }
    }
  }

  addEntriesFromDirectory('./web')

  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['ambire-common'] }
    },
    argv
  )

  const locations = env.locations || (await (0, expoEnv.getPathsAsync)(env.projectRoot))
  const templateIndex = (0, nodeHtmlParser.parse)(
    (0, fsExtra.readFileSync)(locations.template.indexHtml, { encoding: 'utf8' })
  )

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
      config.devServer = {
        ...config.devServer,
        hot: false
      }
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
      // Buffer polyfill, used by web3
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      // Overrides ExpoCopyPlugin
      new CopyPlugin({
        patterns: [
          {
            from: './web/assets',
            to: 'assets'
          },
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
            transform: processManifest
          },
          {
            from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
            to: 'browser-polyfill.js'
          }
        ]
      }),
      // Generate index.html Overrides ExpoHtmlWebpackPlugin
      new HtmlWebpackPlugin(env, templateIndex),
      // Generate notification.html
      new HtmlWebpackPlugin(
        {
          ...env,
          locations: {
            ...locations,
            production: {
              ...locations.production,
              indexHtml: './notification.html'
            }
          }
        },
        templateIndex
      )
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
