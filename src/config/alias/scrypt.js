// Replace the crypto scrypt decryptions from scrypt-js with scrypt from react-native-fast-crypto
// written in C++ giving a much better performance on mobile

const crypto = require('react-native-fast-crypto')
const { syncScrypt } = require('scrypt-js')

exports.syncScrypt = syncScrypt
exports.scrypt = crypto.scrypt
