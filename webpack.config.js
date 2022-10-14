const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['ambire-common'] }
    },
    argv
  )

  // react-native-webview used in native apps
  // react-native-web-webview used in web/browser extension
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

  // Manifest transpilation handled by webpack.extension-services.config.js
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

  return config
}
