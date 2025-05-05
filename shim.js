/* eslint-disable */
import { Buffer } from '@craftzdog/react-native-buffer'

import { shim } from 'react-native-quick-base64'

// Adds btoa and atob functions to global.
shim()

// Installed and imported because of a dependency that uses Buffer functions
// Hack to make Buffer with in RN proj:
// https://stackoverflow.com/questions/48432524/cant-find-variable-buffer/54448930
global.Buffer = Buffer

// Ethers.js installation guide for RN:
// https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative-shims
import 'react-native-get-random-values'
import '@ethersproject/shims'

// rn-nodeify specific shims
// {@link https://github.com/tradle/rn-nodeify/blob/v10.0.1/shim.js}
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

// Commended out in the rn-nodefy shims too.
// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__
// This line breaks our builds, it conflicts with something.
// Since we're not using `NODE_ENV` anywhere, commenting it out sound safe:
// process.env['NODE_ENV'] = isDev ? 'development' : 'production'
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : ''
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
// require('crypto')
