const COMMON_ROUTES = {
  keyStoreUnlock: 'keystore-unlock',
  resetVault: 'reset-vault',
  getStarted: 'get-started',
  createVault: 'create-vault',
  auth: 'auth',
  ambireAccountLogin: 'ambire-account-email-login',
  externalSigner: 'external-signer',
  accountAdder: 'account-adder',
  dashboard: 'dashboard',
  collectible: 'collectible',
  earn: 'earn',
  transfer: 'transfer',
  signAccountOp: 'sign-account-op',
  transactions: 'transactions',
  signedMessages: 'signed-messages',
  keystore: 'keystore',
  gasTank: 'gas-tank',
  pendingTransactions: 'pending-transactions',
  receive: 'receive',
  provider: 'provider',
  signMessage: 'sign-message',
  gasInformation: 'gas-information',
  signers: 'signers',
  menu: 'menu',
  swap: 'swap',
  noConnection: 'no-connection',
  backup: 'backup',
  accounts: 'accounts'
}

const MOBILE_ROUTES = {
  ...COMMON_ROUTES,
  addReferral: 'add-referral',
  connect: 'connect',
  dataDeletionPolicy: 'data-deletion-policy',
  manageVaultLock: 'manage-vault-lock',
  onboardingOnFirstLogin: 'onboarding-on-first-login',
  noConnection: 'no-connection',
  hardwareWallet: 'hardware-wallet',
  dappsCatalog: 'dapps-catalog',
  web3Browser: 'web3-browser',
  enableOtp2FA: 'enable-otp-2fa',
  disableOtp2FA: 'disable-otp-2fa'
}

const WEB_ROUTES = {
  ...COMMON_ROUTES,
  terms: 'terms',
  keyStoreSetup: 'keystore-setup',
  keyStoreReset: 'keystore-reset',
  devicePassword: 'device-password',
  getEncryptionPublicKeyRequest: 'get-encryption-public-key-request',
  onboarding: 'onboarding',
  dappConnectRequest: 'dapp-connect-request',
  watchAsset: 'watch-asset',
  addChain: 'add-chain',
  hardwareWalletSelect: 'hardware-wallet/select',
  hardwareWalletLedger: 'hardware-wallet/ledger',
  authEmailAccount: 'auth-email-account',
  authEmailLogin: 'auth-email-login',
  authEmailRegister: 'auth-email-register',
  accountPersonalize: 'account-personalize',
  accountSelect: 'account-select',
  viewOnlyAccountAdder: 'view-only-account-adder',
  networks: 'networks',
  networksSettings: 'networks/settings',
  importHotWallet: 'import-hot-wallet',
  importPrivateKey: 'import-private-key',
  importSeedPhrase: 'import-seed-phrase',
  createHotWallet: 'create-hot-wallet',
  createSeedPhrasePrepare: 'create-seed-phrase/prepare',
  createSeedPhraseWrite: 'create-seed-phrase/write',
  createSeedPhraseConfirm: 'create-seed-phrase/confirm'
}

const ROUTES = {
  ...COMMON_ROUTES,
  ...MOBILE_ROUTES,
  ...WEB_ROUTES
}

export { ROUTES, MOBILE_ROUTES, WEB_ROUTES }
