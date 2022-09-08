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

  config.entry.ambexMessanger = './web/services/ambexMessanger.js'
  config.entry.pageContext = './web/services/page-context.js'
  config.entry.contentScript = './web/services/content-script.js'

  return config
}
