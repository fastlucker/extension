export enum ROUTES {
  unlockVault = 'unlock-vault',
  resetVault = 'reset-vault',
  noConnection = 'no-connection',
  getStarted = 'get-started',
  createVault = 'create-vault',
  auth = 'auth',
  ambireAccountLogin = 'ambire-account-login',
  ambireAccountLoginPasswordConfirm = 'ambire-account-login-password-confirm',
  ambireAccountJsonLogin = 'ambire-account-json-login',
  ambireAccountJsonLoginPasswordConfirm = 'ambire-account-json-login-password-confirm',
  qrCodeLogin = 'qr-code-login',
  hardwareWallet = 'hardware-wallet',
  externalSigner = 'external-signer',
  dashboard = 'dashboard',
  collectibles = 'collectibles',
  earn = 'earn',
  send = 'send',
  transactions = 'transactions',
  gasTank = 'gas-tank',
  pendingTransactions = 'pending-transactions',
  receive = 'receive',
  provider = 'provider',
  signMessage = 'sign-message',
  gasInformation = 'gas-information',
  signers = 'signers',
  permissionRequest = 'permission-request',
  switchNetwork = 'switch-network',
  watchAsset = 'watch-asset',
  menu = 'menu',
  manageVaultLock = 'manage-vault-lock',
  getEncryptionPublicKeyRequest = 'get-encryption-public-key-request',
  dataDeletionPolicy = 'data-deletion-policy',
  connect = 'connect',
  swap = 'swap'
}

const routesConfig: {
  [key: string]: {
    route: string
    title: string
  }
} = {
  [ROUTES.unlockVault]: {
    route: ROUTES.unlockVault,
    title: 'Welcome Back'
  },
  [ROUTES.resetVault]: {
    route: ROUTES.resetVault,
    title: 'Reset your\nAmbire Key Store Lock'
  },
  [ROUTES.noConnection]: {
    route: ROUTES.noConnection,
    title: 'No Connection'
  },
  [ROUTES.getStarted]: {
    route: ROUTES.getStarted,
    title: 'Welcome'
  },
  [ROUTES.createVault]: {
    route: ROUTES.createVault,
    title: 'Setup Your Ambire Key Store'
  },
  [ROUTES.auth]: {
    route: ROUTES.auth,
    title: 'Welcome to\nAmbire Wallet Extension'
  },
  [ROUTES.ambireAccountLogin]: {
    route: ROUTES.ambireAccountLogin,
    title: 'Login'
  },
  [ROUTES.ambireAccountLoginPasswordConfirm]: {
    route: ROUTES.ambireAccountLoginPasswordConfirm,
    title: 'Confirm Account Password'
  },
  [ROUTES.ambireAccountJsonLogin]: {
    route: ROUTES.ambireAccountJsonLogin,
    title: 'Import from JSON'
  },
  [ROUTES.ambireAccountJsonLoginPasswordConfirm]: {
    route: ROUTES.ambireAccountJsonLoginPasswordConfirm,
    title: 'Confirm Account Password'
  },
  [ROUTES.qrCodeLogin]: {
    route: ROUTES.qrCodeLogin,
    title: 'Import with QR Code'
  },
  [ROUTES.hardwareWallet]: {
    route: ROUTES.hardwareWallet,
    title: 'Login with Hardware Wallet'
  },
  [ROUTES.externalSigner]: {
    route: ROUTES.externalSigner,
    title: 'Login with External Signer'
  },
  [ROUTES.dashboard]: {
    route: ROUTES.dashboard,
    title: 'Dashboard'
  },
  [ROUTES.collectibles]: {
    route: ROUTES.collectibles,
    title: 'Collectibles'
  },
  [ROUTES.earn]: {
    route: ROUTES.earn,
    title: 'Earn'
  },
  [ROUTES.send]: {
    route: ROUTES.send,
    title: 'Send'
  },
  [ROUTES.transactions]: {
    route: ROUTES.transactions,
    title: 'Transactions'
  },
  [ROUTES.gasTank]: {
    route: ROUTES.gasTank,
    title: 'Gas Tank'
  },
  [ROUTES.pendingTransactions]: {
    route: ROUTES.pendingTransactions,
    title: 'Pending Transactions'
  },
  [ROUTES.receive]: {
    route: ROUTES.receive,
    title: 'Receive'
  },
  [ROUTES.provider]: {
    route: ROUTES.provider,
    title: 'Provider'
  },
  [ROUTES.signMessage]: {
    route: ROUTES.signMessage,
    title: 'Sign Message'
  },
  [ROUTES.gasInformation]: {
    route: ROUTES.gasInformation,
    title: 'Gas Information'
  },
  [ROUTES.signers]: {
    route: ROUTES.signers,
    title: 'Manage Signers'
  },
  [ROUTES.permissionRequest]: {
    route: ROUTES.permissionRequest,
    title: 'Webpage Wants to Connect'
  },
  [ROUTES.switchNetwork]: {
    route: ROUTES.switchNetwork,
    title: 'Webpage Wants to Switch Network'
  },
  [ROUTES.watchAsset]: {
    route: ROUTES.watchAsset,
    title: 'Webpage Wants to Add Token'
  },
  [ROUTES.menu]: {
    route: ROUTES.menu,
    title: 'Menu'
  },
  [ROUTES.manageVaultLock]: {
    route: ROUTES.manageVaultLock,
    title: 'Manage Key Store Lock'
  },
  [ROUTES.getEncryptionPublicKeyRequest]: {
    route: ROUTES.getEncryptionPublicKeyRequest,
    title: 'Get Encryption Public Key Request'
  },
  [ROUTES.dataDeletionPolicy]: {
    route: ROUTES.dataDeletionPolicy,
    title: 'Data Deletion Policy'
  },
  [ROUTES.connect]: {
    route: ROUTES.connect,
    title: 'Connect a dApp'
  },
  [ROUTES.swap]: {
    route: ROUTES.swap,
    title: 'Swap'
  }
}

export default routesConfig
