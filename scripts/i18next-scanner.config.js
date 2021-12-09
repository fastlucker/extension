const typescriptTransform = require('i18next-scanner-typescript')

module.exports = {
  options: {
    debug: false,
    func: {
      list: ['i18n.t', 'this.props.t', 'props.t', 't'],
      extensions: ['.js', '.jsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx'],
      fallbackKey: (ns, value) => value,
    },
    lngs: ['en', 'bg'],
    defaultValue: (lng, ns, key) => (lng === 'en' ? key : '__STRING_NOT_TRANSLATED__'),
    resource: {
      loadPath: './src/config/localization/languages/{{lng}}.json',
      savePath: './src/config/localization/languages/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
    removeUnusedKeys: true,
  },
  transform: typescriptTransform({
    // default value for extensions
    extensions: ['.tsx', '.ts'],
    // optional ts configuration
    tsOptions: {
      target: 'es2021',
    },
  }),
}
