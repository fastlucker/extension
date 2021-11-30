module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['plugin:react/recommended', 'airbnb-base', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: ['react', 'prettier', '@typescript-eslint'],
	rules: {
		'prettier/prettier': ['error'],
		'func-names': 0,
		'no-use-before-define': 0,
		'prefer-destructuring': 0,
	},
}
