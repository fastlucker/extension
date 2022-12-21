module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['transform-inline-environment-variables'],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env'
        }
      ],
      ['react-native-reanimated/plugin'],
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json'
          ],
          alias: {
            // alias for better crypto performance on mobile
            'scrypt-js': './src/config/alias/scrypt.js',
            // alias for better crypto performance on mobile
            '@ethersproject/pbkdf2': './src/config/alias/pbkdf2.js',
            // node's crypto polyfill for React Native
            'crypto': 'react-native-quick-crypto',
            // stream-browserify: used by react-native-quick-crypto
            'stream': 'stream-browserify',
            // @craftzdog/react-native-buffer: used by react-native-quick-crypto
            'buffer': '@craftzdog/react-native-buffer',

            // absolute imports
            '@assets': './src/assets',
            '@modules': './src/modules',
            '@config': './src/config',
            '@web': './web'
          }
        }
      ]
    ]
  }
}
