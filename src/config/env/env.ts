import * as Application from 'expo-application'
import Constants from 'expo-constants'
import * as Updates from 'expo-updates'

export const isProd = process.env.APP_ENV === 'production'
export const isStaging = process.env.APP_ENV === 'staging'

export const APP_ID = Application.applicationId
export const APP_VERSION = Constants?.manifest?.version || 'N/A'
export const BUILD_NUMBER = Application.nativeBuildVersion

export const RELEASE_CHANNEL = Updates.releaseChannel || 'N/A'
export const RUNTIME_VERSION = Updates?.runtimeVersion || 'N/A'

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
  CONFIG.TRANSAK_ENV = 'PRODUCTION'
  CONFIG.TRANSAK_API_KEY = '85fdedd7-0077-4c6d-8499-52039c64353c'
} else if (isStaging) {
  CONFIG.APP_ENV = APP_ENV.STAGING
}

export default CONFIG
