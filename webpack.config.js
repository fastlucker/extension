const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const path = require('path')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['ambire-common'] }
    },
    argv
  )

  config.resolve.alias['react-native-webview'] = 'react-native-web-webview'

  return config
}
