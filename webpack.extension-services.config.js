/* eslint-disable import/no-extraneous-dependencies */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

// files to pass in classic webpack
const entries = {
  background: './web/services/background.js',
  'content-script': './web/services/content-script.js',
  'content-script-onComplete': './web/services/content-script-onComplete.js',
  'page-context': './web/services/page-context.js',
  injection: './web/services/injection.js'
}

const getPlugins = () => {
  return [
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './web/assets',
          to: '../assets'
        },
        {
          from: './web/constants',
          to: '../constants'
        },
        {
          from: './web/manifest.json',
          to: '../manifest.json'
        },
        { from: './web/services/ambexMessanger.js', to: './ambexMessanger.js' },
        { from: './web/style.css', to: '../style.css' }
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
  entry: entries,
  module: webpackModule,
  devtool: 'none',
  devServer: {
    writeToDisk: true
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
}

chromeServicesConfig = {
  ...commonConfig,
  plugins: getPlugins(),
  output: {
    path: path.resolve(__dirname, 'web-build/services')
  }
}

module.exports = chromeServicesConfig
