export const isProd = process.env.APP_ENV === 'PRODUCTION'
export const isStaging = process.env.APP_ENV === 'STAGING'

// eslint-disable-next-line @typescript-eslint/naming-convention
enum APP_ENV {
  PROD = 'production',
  STAGING = 'staging',
  DEV = 'development',
}

interface Config {
  APP_ENV: APP_ENV
  RELAYER_URL: string
  ZAPPER_API_ENDPOINT: string
  ZAPPER_API_KEY: string
}

const CONFIG: Config = {
  APP_ENV: APP_ENV.DEV,
  RELAYER_URL: 'https://relayer.ambire.com',
  ZAPPER_API_ENDPOINT: 'https://api.zapper.fi/v1',
  ZAPPER_API_KEY: '96e0cc51-a62e-42ca-acee-910ea7d2a241',
}

if (isProd) {
  CONFIG.APP_ENV = APP_ENV.PROD
} else if (isStaging) {
  CONFIG.APP_ENV = APP_ENV.STAGING
}

export default CONFIG
