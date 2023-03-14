// Replace pbkdf2 from @ethersproject/pbkdf2 with scrypt from react-native-quick-crypto
// written in C++ giving a much better performance on mobile

const crypto = require('react-native-quick-crypto')

exports.pbkdf2 = crypto.pbkdf2Sync
