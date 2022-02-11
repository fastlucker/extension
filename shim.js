/* eslint-disable */
import { Buffer } from 'buffer'

// Ethers.js installation guide for RN:
// https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative-shims
import 'react-native-get-random-values'

import '@ethersproject/shims'

if (typeof __dirname === 'undefined') global.__dirname = '/'
if (typeof __filename === 'undefined') global.__filename = ''
if (typeof process === 'undefined') {
  global.process = require('process')
} else {
  const bProcess = require('process')
  for (const p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p]
    }
  }
}

process.browser = false

// Installed and imported because of a dependency that uses Buffer functions
// Hack to make Buffer with in RN proj:
// https://stackoverflow.com/questions/48432524/cant-find-variable-buffer/54448930
global.Buffer = Buffer

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__
process.env.NODE_ENV = isDev ? 'development' : 'production'
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : ''
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto')
