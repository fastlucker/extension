import loadEnv from 'utils/env/loadEnv'
import parseEnv from 'utils/env/parseEnv'

const envVariables = loadEnv()

// EOA (+7702) env variables
export const baParams = parseEnv(envVariables, 'BA')
// Smart Account env variables
export const saParams = parseEnv(envVariables, 'SA')

export const BA_PASSPHRASE = envVariables.BA_PASSPHRASE
export const SA_PASSPHRASE = envVariables.SA_PASSPHRASE
export const KEYSTORE_PASS = envVariables.KEYSTORE_PASS
export const BA_PRIVATE_KEY = envVariables.BA_PRIVATE_KEY
export const DEF_KEYSTORE_PASS = envVariables.KEYSTORE_PASS
export const NEW_KEYSTORE_PASSWORD = 'B1234566'
