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
            'scrypt-js': './scripts/scrypt.js',
            '@ethersproject/pbkdf2': './scripts/pbkdf2.js',
            'crypto': 'react-native-quick-crypto',
            'stream': 'stream-browserify',
            'buffer': '@craftzdog/react-native-buffer',
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
