import * as Application from 'expo-application'
import Constants from 'expo-constants'
import * as Updates from 'expo-updates'
import { Platform } from 'react-native'

export const isProd = process.env.APP_ENV === 'production'
export const isStaging = process.env.APP_ENV === 'staging'

// On Android, this is the package name. On iOS, this is the bundle ID.
export const APP_ID = Application.applicationId
// Internal app version, example: 1.0.0 (follows semantic versioning)
export const APP_VERSION = Constants?.manifest?.version || 'N/A'
// The internal build version of the native build (binary).
// This is the Info.plist value for `CFBundleVersion` on iOS and
// the `versionCode` set by `build.gradle` on Android.
export const BUILD_NUMBER = Application.nativeBuildVersion || 'N/A'

export const RELEASE_CHANNEL = Updates.releaseChannel || 'N/A'
export const RUNTIME_VERSION = Updates.runtimeVersion || 'N/A'
export const EXPO_SDK = Constants?.manifest?.sdkVersion || 'N/A'

export const isiOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'

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
  SUSHI_SWAP_URL: string
  SENTRY_DSN: string
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
  TRANSAK_ENV: 'STAGING',
  SUSHI_SWAP_URL: 'https://sushiswap-interface-jfomtc62l-ambire.vercel.app/en/swap',
  SENTRY_DSN: 'https://8e5d690e5de843b4bf3cf22a563ee7fc@o1152360.ingest.sentry.io/6230367'
}

if (isProd) {
  CONFIG.APP_ENV = APP_ENV.PROD
  CONFIG.TRANSAK_ENV = 'PRODUCTION'
  CONFIG.TRANSAK_API_KEY = '85fdedd7-0077-4c6d-8499-52039c64353c'
} else if (isStaging) {
  CONFIG.APP_ENV = APP_ENV.STAGING
}

export default CONFIG
