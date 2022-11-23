import CryptoJS from 'crypto-js'

const encrypt = (password: string, data: any): any =>
  new Promise((resolve, reject) => {
    const encryptedData = CryptoJS.AES.encrypt(data, password).toString()

    if (encryptedData) resolve(encryptedData)
    else reject(new Error('Encryption failed'))
  })

const decrypt = (password: string, hash: string): any =>
  new Promise((resolve, reject) => {
    const decryptedData = CryptoJS.AES.decrypt(hash, password).toString(CryptoJS.enc.Utf8)

    if (decryptedData) resolve(decryptedData)
    else reject(new Error('Decryption failed'))
  })

export { encrypt, decrypt }
