// common routes between the mobile app and the extension(web)
const COMMON_ROUTES = {
  // TODO: move here the common routes between the mobile app and the extension
}

const MOBILE_ROUTES = {
  ...COMMON_ROUTES
  // TODO: add here mobile only routes
}

const WEB_ROUTES = {
  ...COMMON_ROUTES,
  keyStoreUnlock: 'keystore-unlock',
  getStarted: 'get-started',
  accountPicker: 'account-picker',
  dashboard: 'dashboard',
  earn: 'earn',
  transfer: 'transfer',
  topUpGasTank: 'top-up-gas-tank',
  signAccountOp: 'sign-account-op',
  transactions: 'transactions',
  signedMessages: 'signed-messages',
  signMessage: 'sign-message',
  menu: 'menu',
  swap: 'swap',
  noConnection: 'no-connection',
  accounts: 'accounts',
  appCatalog: 'app-catalog',
  inviteVerify: 'invite-verify',
  keyStoreSetup: 'keystore-setup',
  keyStoreReset: 'keystore-reset',
  getEncryptionPublicKeyRequest: 'get-encryption-public-key-request',
  dappConnectRequest: 'dapp-connect-request',
  watchAsset: 'watch-asset',
  addChain: 'add-chain',
  switchAccount: 'switch-account',
  hardwareWalletSelect: 'hardware-wallet/select',
  hardwareWalletReconnect: 'hardware-wallet/reconnect',
  hardwareWalletLedger: 'hardware-wallet/ledger',
  authEmailAccount: 'auth-email-account',
  authEmailLogin: 'auth-email-login',
  authEmailRegister: 'auth-email-register',
  accountPersonalize: 'account-personalize',
  accountSelect: 'account-select',
  viewOnlyAccountAdder: 'view-only-account-adder',
  networks: 'networks',
  generalSettings: 'settings/general',
  settingsTerms: 'settings/terms',
  settingsAbout: 'settings/about',
  networksSettings: 'settings/networks',
  accountsSettings: 'settings/accounts',
  basicToSmartSettingsScreen: 'settings/accounts/basic-to-smart',
  exportKey: 'settings/accounts/exportKey',
  devicePasswordSet: 'settings/device-password-set',
  devicePasswordChange: 'settings/device-password-change',
  devicePasswordRecovery: 'settings/device-password-recovery',
  addressBook: 'settings/address-book',
  manageTokens: 'settings/manage-tokens',
  importHotWallet: 'import-hot-wallet',
  importPrivateKey: 'import-private-key',
  importSmartAccountJson: 'import-smart-account-json',
  importSeedPhrase: 'import-seed-phrase',
  importExistingAccount: 'import-existing-account',
  createSeedPhrasePrepare: 'create-seed-phrase/prepare',
  createSeedPhraseWrite: 'create-seed-phrase/write',
  benzin: 'benzin',
  swapAndBridge: 'swap-and-bridge',
  savedSeed: 'saved-seed',
  securityAndPrivacy: 'settings/security-and-privacy',
  onboardingCompleted: 'onboarding-completed'
}

const ROUTES = { ...MOBILE_ROUTES, ...WEB_ROUTES }

export { ROUTES, MOBILE_ROUTES, WEB_ROUTES }
