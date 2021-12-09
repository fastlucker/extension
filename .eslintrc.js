module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier', 'airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
      },
    ],
    'func-names': 0,
    'prefer-destructuring': 0,
    '@typescript-eslint/semi': 'off',
    'react/style-prop-object': 'off',
    'react/function-component-definition': 'off',
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/comma-dangle': 'off',
  },
}
