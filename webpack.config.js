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

  // config.entry.env = './web/constants/env.js'
  // config.entry.browserAPI = './web/constants/browserAPI.js'
  // config.entry.storage = './web/constants/storage.js'
  // config.entry.ambexMessanger = './web/services/ambexMessanger.js'

  return config
}
