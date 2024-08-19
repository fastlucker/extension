export const INVITE_STORAGE_ITEM = {
  status: 'VERIFIED',
  verifiedAt: 1715332416400,
  verifiedCode: 'dummy-test-code'
}

export const baParams = {
  parsedKeystoreAccounts: JSON.parse(process.env.BA_ACCOUNTS),
  parsedIsDefaultWallet: process.env.BA_IS_DEFAULT_WALLET,
  parsedKeyPreferences: JSON.parse(process.env.BA_KEY_PREFERENCES),
  parsedKeystoreUID: process.env.BA_KEYSTORE_UID,
  parsedKeystoreKeys: JSON.parse(process.env.BA_KEYS),
  parsedKeystoreSecrets: JSON.parse(process.env.BA_SECRETS),
  parsedNetworkPreferences: JSON.parse(process.env.BA_NETWORK_PREFERENCES),
  parsedNetworksWithAssetsByAccount: JSON.parse(process.env.BA_NETWORK_WITH_ASSETS),
  parsedOnboardingState: JSON.parse(process.env.BA_ONBOARDING_STATE),
  envPermission: process.env.BA_PERMISSION,
  parsedPreviousHints: JSON.parse(process.env.BA_PREVIOUSHINTS),
  envSelectedAccount: process.env.BA_SELECTED_ACCOUNT,
  envTermState: process.env.BA_TERMSTATE,
  parsedTokenItems: JSON.parse(process.env.BA_TOKEN_ITEMS),
  invite: JSON.stringify(INVITE_STORAGE_ITEM)
}

export const saParams = {
  parsedKeystoreAccounts: JSON.parse(process.env.SA_ACCOUNTS),
  parsedIsDefaultWallet: process.env.SA_IS_DEFAULT_WALLET,
  parsedIsOnBoarded: process.env.SA_IS_ONBOARDED,
  parsedKeyPreferences: JSON.parse(process.env.SA_KEY_PREFERENCES),
  parsedKeystoreUID: process.env.SA_KEYSTORE_UID,
  parsedKeystoreKeys: JSON.parse(process.env.SA_KEYS),
  parsedKeystoreSecrets: JSON.parse(process.env.SA_SECRETS),
  parsedNetworkPreferences: JSON.parse(process.env.SA_NETWORK_PREFERENCES),
  parsedNetworksWithAssetsByAccount: JSON.parse(process.env.SA_NETWORK_WITH_ASSETS),
  parsedOnboardingState: JSON.parse(process.env.SA_ONBOARDING_STATE),
  envPermission: process.env.SA_PERMISSION,
  parsedPreviousHints: JSON.parse(process.env.SA_PREVIOUSHINTS),
  envSelectedAccount: process.env.SA_SELECTED_ACCOUNT,
  envTermState: process.env.SA_TERMSTATE,
  parsedTokenItems: JSON.parse(process.env.SA_TOKEN_ITEMS),
  invite: JSON.stringify(INVITE_STORAGE_ITEM)
}
