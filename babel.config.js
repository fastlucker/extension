module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
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
            '.json',
          ],
          alias: {
            '@components': './src/components',
            '@config': './src/config',
            '@screens': './src/screens',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@contexts': './src/contexts',
          },
        },
      ],
    ],
  }
}
