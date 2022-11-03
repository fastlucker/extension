import passworder from 'browser-passworder'

const encrypt = (password: string, data: any) => passworder.encrypt(password, data)

const decrypt = (password: string, hash: string) => passworder.decrypt(password, hash)

export { encrypt, decrypt }
