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
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const appJSON = require('./app.json')
const AssetReplacePlugin = require('./plugins/AssetReplacePlugin')

const isWebkit = process.env.WEB_ENGINE.startsWith('webkit')
const isGecko = process.env.WEB_ENGINE === 'gecko'
const isSafari = process.env.WEB_ENGINE === 'webkit-safari'

// style.css output file for WEB_ENGINE: GECKO
function processStyleGecko(content) {
  const style = content.toString()
  // Firefox extensions max window height is 600px
  // so IF min-height is changed above 600, this needs to be put back
  // style = style.replace('min-height: 730px;', 'min-height: 600px;')

  return style
}

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)

  function processManifest(content) {
    const manifest = JSON.parse(content.toString())
    if (config.mode === 'development') {
      manifest.name = 'Ambire Wallet Dev'
    }
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

    const csp = "frame-ancestors 'none'; script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"

    if (isGecko) {
      manifest.background = { scripts: ['background.js'] }
      manifest.host_permissions = [...manifest.host_permissions, '<all_urls>']
      manifest.browser_specific_settings = {
        gecko: {
          id: 'wallet@ambire.com',
          strict_min_version: '115.0'
        }
      }
    }

    if (isGecko || isSafari) {
      manifest.externally_connectable = undefined
    }

    const permissions = [...manifest.permissions, 'scripting', 'alarms']
    if (isWebkit && !isSafari) permissions.push('system.display')
    manifest.permissions = permissions

    if (isSafari) {
      manifest.permissions = manifest.permissions.filter((p) => p !== 'notifications')
    }

    manifest.content_security_policy = { extension_pages: csp }

    // This value can be used to control the unique ID of an extension,
    // when it is loaded during development. In prod, the ID is generated
    // in Chrome Web Store and can't be changed.
    // {@link https://developer.chrome.com/extensions/manifest/key}
    // TODO: key not supported in gecko browsers
    if (isWebkit) {
      manifest.key = process.env.BROWSER_EXTENSION_PUBLIC_KEY
    }

    const manifestJSON = JSON.stringify(manifest, null, 2)
    return manifestJSON
  }

  const outputPath = process.env.WEBPACK_BUILD_OUTPUT_PATH
  const isExtension =
    outputPath.includes('webkit') || outputPath.includes('gecko') || outputPath.includes('safari')
  const isBenzin = outputPath.includes('benzin')
  const isLegends = outputPath.includes('legends')

  // Global configuration
  config.resolve.alias['@ledgerhq/devices/hid-framing'] = '@ledgerhq/devices/lib/hid-framing'
  config.resolve.alias.dns = 'dns-js'

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

  // override MiniCssExtractPlugin only for prod to serve the css files in the main build directory
  if (config.mode === 'production') {
    const excludeMiniCssExtractPluginPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (excludeMiniCssExtractPluginPlugin !== -1) {
      config.plugins.splice(excludeMiniCssExtractPluginPlugin, 1)
    }
    defaultExpoConfigPlugins.push(new MiniCssExtractPlugin()) // default filename: [name].css

    // @TODO: The extension doesn't work with splitChunks out of the box, so disable it for now
    config.optimization.minimize = true // optimize bundle by minifying
    config.devtool = false // optimize bundle size for production by removing the source-map
  } else if (config.mode === 'development') {
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

  // There will be 2 instances of React if node_modules are installed in src/ambire-common.
  // That's why we need to alias the React package to the one in the root node_modules.
  config.resolve.alias.react = path.resolve(__dirname, 'node_modules/react')

  config.output = {
    // possible output paths: /webkit-dev, /gecko-dev, /webkit-prod, gecko-prod, /benzin-dev, /benzin-prod, /legends-dev, /legends-prod
    path: path.resolve(__dirname, `build/${process.env.WEBPACK_BUILD_OUTPUT_PATH}`),
    // Defaults to using 'auto', but this is causing problems in some environments
    // like in certain browsers, when building (and running) in extension context.
    publicPath: ''
  }

  // Environment specific configurations
  if (isExtension) {
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

    config.entry = {
      main: config.entry[0], // the app entry
      // extension services
      background: './src/web/extension-services/background/background.ts',
      'content-script':
        './src/web/extension-services/content-script/content-script-messenger-bridge.ts',
      'ambire-inpage': './src/web/extension-services/inpage/ambire-inpage.ts',
      'ethereum-inpage': './src/web/extension-services/inpage/ethereum-inpage.ts'
    }

    if (isGecko) {
      config.entry['content-script-ambire-injection'] =
        './src/web/extension-services/content-script/content-script-ambire-injection.ts'
      config.entry['content-script-ethereum-injection'] =
        './src/web/extension-services/content-script/content-script-ethereum-injection.ts'
    }

    const extensionCopyPatterns = [
      {
        from: './src/web/assets',
        to: 'assets'
      },
      {
        from: './src/web/public/style.css',
        to: 'style.css',
        transform(content) {
          if (isGecko) {
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
        from: './src/web/public/action-window.html',
        to: 'action-window.html'
      },
      {
        from: './src/web/public/tab.html',
        to: 'tab.html'
      },
      {
        from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
        to: 'browser-polyfill.min.js'
      },
      {
        from: require.resolve('@trezor/connect-webextension/build/content-script.js'),
        to: 'vendor/trezor/trezor-content-script.js'
      },
      {
        from: require.resolve('@trezor/connect-webextension/build/trezor-connect-webextension.js'),
        to: 'vendor/trezor/trezor-connect-webextension.js'
      }
    ]

    config.plugins = [
      ...defaultExpoConfigPlugins,
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'], process: 'process' }),

      new CopyPlugin({ patterns: extensionCopyPatterns })
    ]

    if (isGecko) {
      config.plugins.push(
        new AssetReplacePlugin({
          '#AMBIREINPAGE#': 'ambire-inpage',
          '#ETHEREUMINPAGE#': 'ethereum-inpage'
        })
      )
    }

    if (config.mode === 'production') {
      // @TODO: The extension doesn't work with splitChunks out of the box, so disable it for now
      delete config.optimization.splitChunks
    }

    return config
  }
  if (isBenzin) {
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
      })
    ]

    return config
  }
  if (isLegends) {
    if (process.env.APP_ENV === 'development') {
      config.optimization = { minimize: false }
    } else {
      delete config.optimization.splitChunks
    }

    config.entry = './src/legends/index.js'

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
            from: './src/legends/public/style.css',
            to: 'style.css'
          },
          {
            from: './src/legends/public/index.html',
            to: 'index.html'
          },
          {
            from: './src/legends/public/favicon.ico',
            to: 'favicon.ico'
          }
        ]
      })
    ]

    return config
  }
  // @TODO: Add mobile app build configuration here

  throw new Error('Invalid WEBPACK_BUILD_OUTPUT_PATH')
}
