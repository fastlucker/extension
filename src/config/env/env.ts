import { NETWORKS } from 'ambire-common/src/constants/networks'
import * as Application from 'expo-application'
import Constants from 'expo-constants'
import * as Updates from 'expo-updates'
import { Platform } from 'react-native'

import { RPC_KEY_ETHEREUM } from '@env'

import appJSON from '../../../app.json'

export const isProd = process.env.APP_ENV === 'production'
export const isStaging = process.env.APP_ENV === 'staging'

// On Android, this is the package name. On iOS, this is the bundle ID.
export const APP_ID = Application.applicationId
// Internal app version, example: 1.0.0 (follows semantic versioning).
// Fallback to the appJSON version, because in web mode Constants are missing.
export const APP_VERSION = Constants?.manifest?.version || appJSON.expo.version
// The internal build version of the native build (binary).
// This is the Info.plist value for `CFBundleVersion` on iOS and
// the `versionCode` set by `build.gradle` on Android.
export const BUILD_NUMBER = Application.nativeBuildVersion || 'N/A'

export const RELEASE_CHANNEL = Updates.releaseChannel || 'N/A'
export const RUNTIME_VERSION = Updates.runtimeVersion || 'N/A'
export const EXPO_SDK = Constants?.manifest?.sdkVersion || 'N/A'

export const isiOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const isWeb = Platform.OS === 'web'

// eslint-disable-next-line @typescript-eslint/naming-convention
enum APP_ENV {
  PROD = 'production',
  STAGING = 'staging',
  DEV = 'development'
}

interface Config {
  APP_ENV: APP_ENV
  APP_RELAYRLESS: boolean
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
  SIGNATURE_VERIFIER_DEBUGGER: number
  CONSTANTS_ENDPOINT: string
  RPC_KEYS: {
    [key in NETWORKS]?: string
  }
}

const CONFIG: Config = {
  APP_ENV: APP_ENV.DEV,
  APP_RELAYRLESS: false,
  RELAYER_URL: 'https://relayer.ambire.com',
  ZAPPER_API_ENDPOINT: 'https://api.zapper.fi/v1',
  ZAPPER_API_KEY: '96e0cc51-a62e-42ca-acee-910ea7d2a241',
  VELCRO_API_ENDPOINT: 'https://velcro.ambire.com/v1',
  RAMP_HOST_API_KEY: 'jfmvma5hxecxjht293qmbu7bc7jx3sc9tg48a2so',
  PAYTRIE_PARTNER_URL: 'https://app.paytrie.com/?app=876454',
  TRANSAK_API_KEY: '325625ed-5a85-4131-ae50-ea7906332fb3',
  TRANSAK_ENV: 'STAGING',
  // SushiSwap v2. For v1, use 'https://sushiswap-interface-ten.vercel.app/swap'
  SUSHI_SWAP_URL: 'https://sushiswap-interface-jfomtc62l-ambire.vercel.app/en/swap',
  SENTRY_DSN: 'https://8e5d690e5de843b4bf3cf22a563ee7fc@o1152360.ingest.sentry.io/6230367',
  SIGNATURE_VERIFIER_DEBUGGER: 0,
  CONSTANTS_ENDPOINT: 'https://jason.ambire.com',
  RPC_KEYS: {
    [NETWORKS.ethereum]: RPC_KEY_ETHEREUM
  }
}

if (isProd) {
  CONFIG.APP_ENV = APP_ENV.PROD
  CONFIG.TRANSAK_ENV = 'PRODUCTION'
  CONFIG.TRANSAK_API_KEY = '85fdedd7-0077-4c6d-8499-52039c64353c'
} else if (isStaging) {
  CONFIG.APP_ENV = APP_ENV.STAGING
}

// That's special app mode, which is ment to be turned on only manually.
export const isRelayerless = CONFIG.APP_RELAYRLESS || !CONFIG.RELAYER_URL

export default CONFIG
