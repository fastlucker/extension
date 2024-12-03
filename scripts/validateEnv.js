const REQUIRED_ENV_VARIABLES = [
  'RELAYER_URL',
  'VELCRO_URL',
  'BROWSER_EXTENSION_PUBLIC_KEY',
  'REACT_APP_PIMLICO_API_KEY',
  'REACT_APP_JIFFYSCAN_API_KEY',
  'NFT_CDN_URL',
  'LEGENDS_NFT_ADDRESS',
  'SOCKET_API_KEY'
]

const PRODUCTION_VARIABLES = [
  {
    name: 'RELAYER_URL',
    value: 'https://relayer.ambire.com'
  },
  {
    name: 'VELCRO_URL',
    value: 'https://relayer.ambire.com/velcro-v3'
  }
]

const validateEnvVariables = (envVariables, environment) => {
  REQUIRED_ENV_VARIABLES.forEach((variable) => {
    if (!Object.hasOwn(envVariables, variable) || envVariables[variable] === undefined) {
      throw new Error(`Missing required environment variable: ${variable}`)
    } else if (environment === 'production') {
      const value = envVariables[variable]
      const productionVariable = PRODUCTION_VARIABLES.find((v) => v.name === variable)

      if (productionVariable && productionVariable.value !== value) {
        throw new Error(`Invalid production environment variable: ${variable} = ${value}`)
      }
    }
  })
}

module.exports = {
  validateEnvVariables
}
