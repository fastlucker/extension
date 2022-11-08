import CryptoJS from 'crypto-js'

const encrypt = (password: string, data: any) =>
  new Promise((resolve, reject) => {
    const encryptedData = CryptoJS.AES.encrypt(data, password).toString()

    if (encryptedData) resolve(encryptedData)
    else reject()
  })

const decrypt = (password: string, hash: string) =>
  new Promise((resolve, reject) => {
    const decryptedData = CryptoJS.AES.decrypt(hash, password).toString(CryptoJS.enc.Utf8)

    if (decryptedData) resolve(decryptedData)
    else reject()
  })

export { encrypt, decrypt }
