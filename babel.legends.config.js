module.exports = function (api) {
  api.cache(true)

  const pathAliases = {
    '@ambire-common': './src/ambire-common/src',
    '@contracts': './src/ambire-common/contracts',
    // v1 is legacy and should be removed when v1 imports are replaced with @ambire-common
    '@ambire-common-v1': './src/ambire-common/v1',
    '@common': './src/common',
    '@mobile': './src/mobile',
    '@web': './src/web',
    '@benzin': './src/benzin',
    '@legends': './src/legends'
  }

  return {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
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
          alias: pathAliases
        }
      ]
    ]
  }
}
