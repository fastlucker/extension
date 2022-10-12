const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['ambire-common'] }
    },
    argv
  )

  config.resolve.alias['react-native-webview'] = 'react-native-web-webview'

  if (config.mode === 'production') {
    const excludeCopyPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'CopyPlugin'
    )
    if (excludeCopyPlugin !== -1) {
      config.plugins.splice(excludeCopyPlugin, 1)
    }

    const excludeCleanWebpackPlugin = config.plugins.findIndex(
      (plugin) => plugin.constructor.name === 'CleanWebpackPlugin'
    )
    if (excludeCleanWebpackPlugin !== -1) {
      config.plugins.splice(excludeCleanWebpackPlugin, 1)
    }
  }

  if (config.mode === 'development') {
    config.devServer.writeToDisk = true
  }

  return config
}
