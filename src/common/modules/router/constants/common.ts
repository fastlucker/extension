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
  emailVault: 'email-vault',
  emailVaultKeystoreSecretBackup: 'email-vault-keystore-secret-backup',
  emailVaultKeystoreRecover: 'email-vault-keystore-recover',
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
  collection: 'collection',
  accountSelect: 'account-select',
  viewOnlyAccountAdder: 'view-only-account-adder',
  networks: 'networks',
  importHotWallet: 'import-hot-wallet',
  importPrivateKey: 'import-private-key',
  importSeedPhrase: 'import-seed-phrase'
}

const ROUTES = {
  ...COMMON_ROUTES,
  ...MOBILE_ROUTES,
  ...WEB_ROUTES
}

export { ROUTES, MOBILE_ROUTES, WEB_ROUTES }
