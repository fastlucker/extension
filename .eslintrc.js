module.exports = {
  extends: ['./node_modules/ambire-common/.eslintrc.js'],
  rules: {
    'import/extensions': 'off'
  },
  env: {
    "browser": true,
    "node": true
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  'globals': {
    'process': 'readonly',
    'chrome': 'readonly',
    'injectWeb3': 'readonly',
    'browser': 'readonly',
    '__dirname': 'readonly',
    'chromeTargetConfig': 'writable',
    'firefoxTargetConfig': 'writable',
    'Web3': true
  }
}
