/* eslint-disable import/no-extraneous-dependencies */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

// files to pass in classic webpack
const entries = {
  background: { import: './web/services/background.js', filename: 'background.js' },
  'content-script': { import: './web/services/content-script.js', filename: 'content-script.js' },
  'content-script-onComplete': {
    import: './web/services/content-script-onComplete.js',
    filename: 'content-script-onComplete.js'
  },
  'page-context': { import: './web/services/page-context.js', filename: 'page-context.js' },
  injection: { import: './web/services/injection.js', filename: 'injection.js' }
}

const getPlugins = () => {
  return [
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './web/manifest.json',
          to: '../manifest.json'
        },
        { from: './web/services/ambexMessanger.js', to: './ambexMessanger.js' }
      ]
    })
  ]
}

const webpackModule = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    }
  ]
}

const commonConfig = {
  mode: 'production',
  entry: entries,
  module: webpackModule,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts']
  }
}

chromeTargetConfig = {
  ...commonConfig,
  plugins: getPlugins(),
  output: {
    path: path.resolve(__dirname, 'web-build/services')
  }
}

module.exports = chromeTargetConfig
