// eslint-disable-next-line @typescript-eslint/dot-notation
export const isProd = process.env['APP_ENV'] === 'PRODUCTION'
// eslint-disable-next-line @typescript-eslint/dot-notation
export const isStaging = process.env['APP_ENV'] === 'STAGING'

// eslint-disable-next-line @typescript-eslint/naming-convention
enum APP_ENV {
  PROD = 'production',
  STAGING = 'staging',
  DEV = 'development'
}

interface Config {
  APP_ENV: APP_ENV
  RELAYER_URL: string
  ZAPPER_API_ENDPOINT: string
  ZAPPER_API_KEY: string
  VELCRO_API_ENDPOINT: string
  RAMP_HOST_API_KEY: string
  PAYTRIE_PARTNER_URL: string
  TRANSAK_API_KEY: string
  TRANSAK_ENV: string
}

const CONFIG: Config = {
  APP_ENV: APP_ENV.DEV,
  RELAYER_URL: 'https://relayer.ambire.com',
  ZAPPER_API_ENDPOINT: 'https://api.zapper.fi/v1',
  ZAPPER_API_KEY: '96e0cc51-a62e-42ca-acee-910ea7d2a241',
  VELCRO_API_ENDPOINT: 'https://velcro.ambire.com/v1',
  RAMP_HOST_API_KEY: 'jfmvma5hxecxjht293qmbu7bc7jx3sc9tg48a2so',
  PAYTRIE_PARTNER_URL: 'https://partner.paytrie.com/?app=876454',
  TRANSAK_API_KEY: '325625ed-5a85-4131-ae50-ea7906332fb3',
  TRANSAK_ENV: 'STAGING'
}

if (isProd) {
  CONFIG.APP_ENV = APP_ENV.PROD
} else if (isStaging) {
  CONFIG.APP_ENV = APP_ENV.STAGING
}

export default CONFIG
