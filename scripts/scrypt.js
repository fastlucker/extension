const crypto = require('react-native-fast-crypto')
const { syncScrypt } = require('scrypt-js')

exports.syncScrypt = syncScrypt
exports.scrypt = crypto.scrypt
