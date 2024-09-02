const REQUIRED_ENV_VARIABLES = [
  'BA_ACCOUNTS',
  'BA_IS_DEFAULT_WALLET',
  'BA_KEY_PREFERENCES',
  'BA_KEYSTORE_UID',
  'BA_KEYS',
  'BA_SECRETS',
  'BA_NETWORK_PREFERENCES',
  'BA_NETWORK_WITH_ASSETS',
  'BA_ONBOARDING_STATE',
  'BA_PERMISSION',
  'BA_PREVIOUSHINTS',
  'BA_SELECTED_ACCOUNT',
  'BA_TERMSTATE',
  'BA_TOKEN_ITEMS',
  'SA_ACCOUNTS',
  'SA_IS_DEFAULT_WALLET',
  'SA_IS_ONBOARDED',
  'SA_KEY_PREFERENCES',
  'SA_KEYSTORE_UID',
  'SA_KEYS',
  'SA_SECRETS',
  'SA_NETWORK_PREFERENCES',
  'SA_NETWORK_WITH_ASSETS',
  'SA_ONBOARDING_STATE',
  'SA_PERMISSION',
  'SA_PREVIOUSHINTS',
  'SA_SELECTED_ACCOUNT',
  'SA_TERMSTATE',
  'SA_TOKEN_ITEMS'
]

export const validateEnvVariables = (envVariables) => {
  REQUIRED_ENV_VARIABLES.forEach((variable) => {
    if (!Object.hasOwn(envVariables, variable) || envVariables[variable] === undefined) {
      throw new Error(`Missing required environment variable: ${variable}`)
    }
  })
}
