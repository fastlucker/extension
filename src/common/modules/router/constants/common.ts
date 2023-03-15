const COMMON_ROUTES = {
  unlockVault: 'unlock-vault',
  resetVault: 'reset-vault',
  getStarted: 'get-started',
  createVault: 'create-vault',
  auth: 'auth',
  ambireAccountLogin: 'ambire-account-login',
  ambireAccountLoginPasswordConfirm: 'ambire-account-login-password-confirm',
  ambireAccountJsonLogin: 'ambire-account-json-login',
  ambireAccountJsonLoginPasswordConfirm: 'ambire-account-json-login-password-confirm',
  externalSigner: 'external-signer',
  selectAccounts: 'select-accounts',
  dashboard: 'dashboard',
  collectibles: 'collectibles',
  earn: 'earn',
  send: 'send',
  transactions: 'transactions',
  gasTank: 'gas-tank',
  pendingTransactions: 'pending-transactions',
  receive: 'receive',
  provider: 'provider',
  signMessage: 'sign-message',
  gasInformation: 'gas-information',
  signers: 'signers',
  menu: 'menu',
  swap: 'swap'
}

const MOBILE_ROUTES = {
  ...COMMON_ROUTES,
  qrCodeLogin: 'qr-code-login',
  connect: 'connect',
  dataDeletionPolicy: 'data-deletion-policy',
  manageVaultLock: 'manage-vault-lock',
  noConnection: 'no-connection',
  hardwareWallet: 'hardware-wallet'
}

const WEB_ROUTES = {
  ...COMMON_ROUTES,
  getEncryptionPublicKeyRequest: 'get-encryption-public-key-request',
  onboarding: 'onboarding',
  permissionRequest: 'permission-request',
  switchNetwork: 'switch-network',
  watchAsset: 'watch-asset',
  hardwareWalletSelect: 'hardware-wallet/select',
  hardwareWalletLedger: 'hardware-wallet/ledger',
  hardwareWalletLedgerPermission: 'hardware-wallet/ledger-permission'
}

const ROUTES = {
  ...COMMON_ROUTES,
  ...MOBILE_ROUTES,
  ...WEB_ROUTES
}

export { ROUTES, MOBILE_ROUTES, WEB_ROUTES }
