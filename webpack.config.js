// The 'react-native-dotenv' package doesn't work in the NodeJS context (and
// with commonjs imports), so alternatively, use 'dotend' package to load the
// environment variables from the .env file.
require('dotenv').config()

const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const webpack = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const expoEnv = require('@expo/webpack-config/env')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const appJSON = require('./app.json')
const AssetReplacePlugin = require('./plugins/AssetReplacePlugin')

module.exports = async function (env, argv) {
  function processManifest(content) {
    const manifest = JSON.parse(content.toString())
    // TODO: Manifest V3 support for Chromium browsers has also been implemented.
    // However, there is one remaining unresolved issue: @trezor/connect-web is not intended to work in a service worker.
    // Trezor is currently developing a new package, but it is still a work in progress.
    // There is a workaround that enables the use of @trezor/connect-web with Manifest V3, but
    // some of the logic needs to be moved from the service worker to the frontend (FE), which is not an optimal solution at the moment.
    // https://github.com/trezor/trezor-suite/issues/6458
    // https://github.com/trezor/trezor-suite/pull/9525
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
    //   'wasm-eval' needed, otherwise the GridPlus SDK fires errors
    //   (GridPlus needs to allow inline Web Assembly (wasm))
    //   2. The "object-src" directive may be required in some browsers that
    //   support obsolete plugins and should be set to a secure source such as
    //   'none' when needed. This may be necessary for browsers up until 2022.
    //   3. The "frame-ancestors" directive specifies valid parents that may
    //   embed a page using <frame>, <iframe>, <object>, <embed>, or <applet>.
    // {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources}
    // {@link https://web.dev/csp/}
    const csp = "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"

    if (manifestVersion === 3) {
      manifest.content_security_policy = {
        extension_pages: csp
      }
      manifest.content_scripts = [
        ...manifest.content_scripts,
        {
          all_frames: false,
          matches: ['file://*/*', 'http://*/*', 'https://*/*'],
          exclude_matches: ['*://doInWebPack.lan/*'],
          run_at: 'document_start',
          js: ['browser-polyfill.min.js', 'content-script.js']
        }
      ]
      // This value can be used to control the unique ID of an extension,
      // when it is loaded during development. In prod, the ID is generated
      // in Chrome Web Store and can't be changed.
      // {@link https://developer.chrome.com/extensions/manifest/key}
      // TODO: Figure out if this works for gecko
      manifest.permissions = [...manifest.permissions, 'scripting', 'system.display']
      manifest.key = process.env.BROWSER_EXTENSION_PUBLIC_KEY
    }

    // Tweak manifest file, so it's compatible with gecko extensions specifics
    if (manifestVersion === 2) {
      manifest.manifest_version = 2
      manifest.background = {
        scripts: ['background.js'],
        persistent: true
      }
      manifest.content_scripts = [
        ...manifest.content_scripts,
        {
          all_frames: true,
          matches: ['file://*/*', 'http://*/*', 'https://*/*'],
          exclude_matches: ['*://doInWebPack.lan/*'],
          run_at: 'document_start',
          js: ['browser-polyfill.min.js', 'content-script.js']
        }
      ]
      // Chrome extensions do not respect `browser_specific_settings`
      // {@link https://stackoverflow.com/a/72527986/1333836}
      if (process.env.WEB_ENGINE === 'gecko') {
        manifest.browser_specific_settings = {
          gecko: {
            id: 'webextension@ambire.com',
            strict_min_version: '68.0'
          }
        }
      }
      manifest.web_accessible_resources = ['*']
      manifest.host_permissions = undefined
      manifest.browser_action = JSON.parse(JSON.stringify(manifest.action))
      delete manifest.action
      manifest.externally_connectable = undefined
      manifest.permissions.push('<all_urls>')
      manifest.content_security_policy = csp
    }

    const manifestJSON = JSON.stringify(manifest, null, 2)
    return manifestJSON
  }

  // style.css output file for WEB_ENGINE: GECKO
  function processStyleGecko(content) {
    const style = content.toString()
    // Firefox extensions max window height is 600px
    // so IF min-height is changed above 600, this needs to be put back
    // style = style.replace('min-height: 730px;', 'min-height: 600px;')

    return style
  }

  const locations = env.locations || (await (0, expoEnv.getPathsAsync)(env.projectRoot))
  const templatePath = (fileName = '') => path.join(__dirname, './src/web', fileName)
  const templatePaths = {
    get: templatePath,
    folder: templatePath(),
    indexHtml: templatePath('index.html'),
    manifest: templatePath('manifest.json'),
    serveJson: templatePath('serve.json'),
    favicon: templatePath('favicon.ico')
  }
  locations.template = templatePaths

  const config = await createExpoWebpackConfigAsync(env, argv)

  // config.resolve.alias['react-native-webview'] = 'react-native-web-webview'
  config.resolve.alias['@ledgerhq/devices/hid-framing'] = '@ledgerhq/devices/lib/hid-framing'
  config.resolve.alias.dns = 'dns-js'

  config.entry = {
    main: config.entry[0], // the app entry
    background: './src/web/extension-services/background/background.ts', // custom entry needed for the extension
    'content-script': './src/web/extension-services/content-script/content-script.ts', // custom entry needed for the extension
    inpage: './src/web/extension-services/inpage/inpage.ts' // custom entry needed for the extension
  }

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

  const defaultExpoConfigPlugins = [...config.plugins]

  config.plugins = [
    ...defaultExpoConfigPlugins,
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process'
    }),
    new AssetReplacePlugin({
      '#PAGEPROVIDER#': 'inpage'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/web/assets',
          to: 'assets'
        },
        {
          from: './src/web/vendor',
          to: 'vendor'
        },
        {
          from: './src/web/public/style.css',
          to: 'style.css',
          transform(content) {
            if (process.env.WEB_ENGINE === 'gecko') {
              return processStyleGecko(content)
            }

            return content
          }
        },
        {
          from: './src/web/public/manifest.json',
          to: 'manifest.json',
          transform: processManifest
        },
        {
          from: './src/web/public/index.html',
          to: 'index.html'
        },
        {
          from: './src/web/public/notification.html',
          to: 'notification.html'
        },
        {
          from: './src/web/public/tab.html',
          to: 'tab.html'
        },
        {
          from: './src/web/public/trezor-usb-permissions.html',
          to: 'trezor-usb-permissions.html'
        },
        {
          from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
          to: 'browser-polyfill.min.js'
        }
      ]
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [
            {
              source: path.join(__dirname, 'src/ambire-common/node_modules/').replaceAll('\\', '/'),
              options: {
                force: true,
                recursive: true
              }
            }
          ]
        }
      }
    })
  ]

  if (config.mode === 'production') {
    // @TODO: The extension doesn't work with splitChunks out of the box, so disable it for now
    delete config.optimization.splitChunks
    config.devtool = false // optimize bundle size for production by removing the source-map
  }

  if (config.mode === 'development') {
    // writeToDisk: output dev bundled files (in /webkit-dev or /gecko-dev) to import them as unpacked extension in the browser
    config.devServer.devMiddleware.writeToDisk = true
  }

  config.ignoreWarnings = [
    {
      // Ignore any warnings that include the text 'Failed to parse source map'.
      // As far as we could debug, these are not critical and lib specific.
      // Webpack can't find source maps for specific packages, which is fine.
      message: /Failed to parse source map/
    }
  ]

  config.resolve.fallback = {}
  config.resolve.fallback.stream = require.resolve('stream-browserify')
  config.resolve.fallback.crypto = require.resolve('crypto-browserify')

  config.output = {
    // possible output paths: /webkit-dev, /gecko-dev, /webkit-prod, gecko-prod
    path: path.resolve(__dirname, `${process.env.WEBPACK_BUILD_OUTPUT_PATH}`),
    // Defaults to using 'auto', but this is causing problems in some environments
    // like in certain browsers, when building (and running) in extension context.
    publicPath: ''
  }

  if (process.env.WEBPACK_BUILD_OUTPUT_PATH.includes('benzin')) {
    if (process.env.APP_ENV === 'development') {
      config.optimization = { minimize: false }
    } else {
      delete config.optimization.splitChunks
    }

    config.entry = './src/benzin/index.js'

    config.plugins = [
      ...defaultExpoConfigPlugins,
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: './src/web/assets',
            to: 'assets'
          },
          {
            from: './src/benzin/public/style.css',
            to: 'style.css'
          },
          {
            from: './src/benzin/public/index.html',
            to: 'index.html'
          },
          {
            from: './src/benzin/public/favicon.ico',
            to: 'favicon.ico'
          }
        ]
      }),
      new FileManagerPlugin({
        events: {
          onStart: {
            delete: [
              {
                source: path
                  .join(__dirname, 'src/ambire-common/node_modules/')
                  .replaceAll('\\', '/'),
                options: {
                  force: true,
                  recursive: true
                }
              }
            ]
          }
        }
      })
    ]

    return config
  }

  config.optimization = { minimize: false }

  return config
}
