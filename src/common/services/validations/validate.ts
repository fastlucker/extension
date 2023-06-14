import isEmail from 'validator/es/lib/isEmail'

const isValidCode = (code: string) => code.length === 6

const isValidPassword = (password: string) => password.length >= 8

export { isEmail, isValidCode, isValidPassword }
