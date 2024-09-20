/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const LEGENDS_REACT_PUBLIC_PATH = 'src/legends/public'
const BUILD_DESTINATION = `build/${process.env.WEBPACK_BUILD_OUTPUT_PATH}`

module.exports = (_, argv) => {
  const isDevelopment = argv.mode === 'development'
  const isProduction = argv.mode === 'production'

  return {
    mode: argv.mode,
    entry: './src/legends/index.js', // Entry point of your application
    output: {
      filename: 'bundle.js', // Output bundle file name
      path: path.resolve(__dirname, BUILD_DESTINATION),
      clean: true // Clean the output directory before each build
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, 'babel.legends.config.js') // Custom path here
            }
          }
        },
        {
          test: /\.module\.scss$/, // SCSS module rule
          use: [
            'style-loader', // Injects styles into the DOM
            {
              loader: 'css-loader',
              options: {
                modules: true, // Enable CSS modules
                esModule: false // Add this line
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, './src/legends')]
                }
              }
            } // Compiles Sass to CSS
          ]
        },
        {
          test: /\.scss$/, // Regular SCSS rule (for global styles)
          exclude: /\.module\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', 'scss'],
      alias: {
        '@ambire-common': path.resolve(__dirname, 'src/ambire-common/src'),
        '@contracts': path.resolve(__dirname, 'src/ambire-common/contracts'),
        '@ambire-common-v1': path.resolve(__dirname, 'src/ambire-common/v1'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@mobile': path.resolve(__dirname, 'src/mobile'),
        '@web': path.resolve(__dirname, 'src/web'),
        '@benzin': path.resolve(__dirname, 'src/benzin'),
        '@legends': path.resolve(__dirname, 'src/legends')
      }
    },
    optimization: {
      usedExports: true,
      minimize: !isProduction
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/legends/public/index.html',
        filename: 'index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: LEGENDS_REACT_PUBLIC_PATH, // Source directory
            to: path.resolve(__dirname, BUILD_DESTINATION), // Destination directory
            globOptions: {
              ignore: ['**/*.html'] // Ignore HTML files as they are handled by HtmlWebpackPlugin
            }
          }
        ]
      })
    ],
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
      static: path.join(__dirname, LEGENDS_REACT_PUBLIC_PATH),
      port: 3000
    }
  }
}
