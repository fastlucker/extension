const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['ambire-common'] }
    },
    argv
  )

  // Alias the 'react-native-webview' package, in order to add support
  // (web implementation) of React Native's WebView. See:
  // {@link https://github.com/react-native-web-community/react-native-web-webview}
  config.resolve.alias['react-native-webview'] = 'react-native-web-webview'

  return config
}
