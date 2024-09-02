import { INVITE_STORAGE_ITEM } from '../constants/constants'
import { loadEnv } from './setupEnv'

const loadedEnvVariables = loadEnv()

const parseEnvVariables = (envVariables, prefix) => {
  if (prefix !== 'SA' && prefix !== 'BA') {
    throw new Error(`Invalid ${prefix}. Expected 'SA' or 'BA'`)
  }

  const params = {
    parsedKeystoreAccounts: JSON.parse(envVariables[`${prefix}_ACCOUNTS`]),
    parsedIsDefaultWallet: envVariables[`${prefix}_IS_DEFAULT_WALLET`],
    parsedKeyPreferences: JSON.parse(envVariables[`${prefix}_KEY_PREFERENCES`]),
    parsedKeystoreUID: envVariables[`${prefix}_KEYSTORE_UID`],
    parsedKeystoreKeys: JSON.parse(envVariables[`${prefix}_KEYS`]),
    parsedKeystoreSecrets: JSON.parse(envVariables[`${prefix}_SECRETS`]),
    parsedNetworkPreferences: JSON.parse(envVariables[`${prefix}_NETWORK_PREFERENCES`]),
    parsedNetworksWithAssetsByAccount: JSON.parse(envVariables[`${prefix}_NETWORK_WITH_ASSETS`]),
    parsedOnboardingState: JSON.parse(envVariables[`${prefix}_ONBOARDING_STATE`]),
    envPermission: envVariables[`${prefix}_PERMISSION`],
    parsedPreviousHints: JSON.parse(envVariables[`${prefix}_PREVIOUSHINTS`]),
    envSelectedAccount: envVariables[`${prefix}_SELECTED_ACCOUNT`],
    envTermState: envVariables[`${prefix}_TERMSTATE`],
    parsedTokenItems: JSON.parse(envVariables[`${prefix}_TOKEN_ITEMS`]),
    invite: JSON.stringify(INVITE_STORAGE_ITEM),
    ...(prefix === 'SA' && { parsedIsOnBoarded: envVariables[`${prefix}_IS_ONBOARDED`] })
  }

  return params
}

export const baParams = parseEnvVariables(loadedEnvVariables, 'BA')
export const saParams = parseEnvVariables(loadedEnvVariables, 'SA')
