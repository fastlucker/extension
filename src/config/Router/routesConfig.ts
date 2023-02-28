import i18n from '@config/localization/localization'

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
  [key in ROUTES]: {
    route: ROUTES
    webTitle: string
    mobileTitle: string
  }
} = {
  [ROUTES.unlockVault]: {
    route: ROUTES.unlockVault,
    webTitle: i18n.t('Welcome Back'),
    mobileTitle: i18n.t('Welcome Back')
  },
  [ROUTES.resetVault]: {
    route: ROUTES.resetVault,
    webTitle: i18n.t('Reset your\nAmbire Key Store Lock'),
    mobileTitle: i18n.t('Reset Ambire Key Store')
  },
  [ROUTES.noConnection]: {
    route: ROUTES.noConnection,
    webTitle: i18n.t('No Connection'),
    mobileTitle: i18n.t('No Connection')
  },
  [ROUTES.getStarted]: {
    route: ROUTES.getStarted,
    webTitle: i18n.t('Welcome'),
    mobileTitle: i18n.t('Welcome')
  },
  [ROUTES.createVault]: {
    route: ROUTES.createVault,
    webTitle: i18n.t('Setup Your Ambire Key Store'),
    mobileTitle: i18n.t('Setup Your Ambire Key Store')
  },
  [ROUTES.auth]: {
    route: ROUTES.auth,
    webTitle: i18n.t('Welcome to\nAmbire Wallet Extension'),
    mobileTitle: i18n.t('Welcome to Ambire')
  },
  [ROUTES.ambireAccountLogin]: {
    route: ROUTES.ambireAccountLogin,
    webTitle: i18n.t('Login'),
    mobileTitle: i18n.t('Login')
  },
  [ROUTES.ambireAccountLoginPasswordConfirm]: {
    route: ROUTES.ambireAccountLoginPasswordConfirm,
    webTitle: i18n.t('Confirm Account Password'),
    mobileTitle: i18n.t('Login')
  },
  [ROUTES.ambireAccountJsonLogin]: {
    route: ROUTES.ambireAccountJsonLogin,
    webTitle: i18n.t('Import from JSON'),
    mobileTitle: i18n.t('Import from JSON')
  },
  [ROUTES.ambireAccountJsonLoginPasswordConfirm]: {
    route: ROUTES.ambireAccountJsonLoginPasswordConfirm,
    webTitle: i18n.t('Confirm Account Password'),
    mobileTitle: i18n.t('Login')
  },
  [ROUTES.qrCodeLogin]: {
    route: ROUTES.qrCodeLogin,
    webTitle: i18n.t('Import with QR Code'),
    mobileTitle: i18n.t('Import with QR Code')
  },
  [ROUTES.hardwareWallet]: {
    route: ROUTES.hardwareWallet,
    webTitle: i18n.t('Login with Hardware Wallet'),
    mobileTitle: i18n.t('Login with Hardware Wallet')
  },
  [ROUTES.externalSigner]: {
    route: ROUTES.externalSigner,
    webTitle: i18n.t('Login with External Signer'),
    mobileTitle: i18n.t('Login with External Signer')
  },
  [ROUTES.dashboard]: {
    route: ROUTES.dashboard,
    webTitle: i18n.t('Dashboard'),
    mobileTitle: i18n.t('Dashboard')
  },
  [ROUTES.collectibles]: {
    route: ROUTES.collectibles,
    webTitle: i18n.t('Collectibles'),
    mobileTitle: i18n.t('Collectibles')
  },
  [ROUTES.earn]: {
    route: ROUTES.earn,
    webTitle: i18n.t('Earn'),
    mobileTitle: i18n.t('Earn')
  },
  [ROUTES.send]: {
    route: ROUTES.send,
    webTitle: i18n.t('Send'),
    mobileTitle: i18n.t('Send')
  },
  [ROUTES.transactions]: {
    route: ROUTES.transactions,
    webTitle: i18n.t('Transactions'),
    mobileTitle: i18n.t('Transactions')
  },
  [ROUTES.gasTank]: {
    route: ROUTES.gasTank,
    webTitle: i18n.t('Gas Tank'),
    mobileTitle: i18n.t('Gas Tank')
  },
  [ROUTES.pendingTransactions]: {
    route: ROUTES.pendingTransactions,
    webTitle: i18n.t('Pending Transactions'),
    mobileTitle: i18n.t('Pending Transactions')
  },
  [ROUTES.receive]: {
    route: ROUTES.receive,
    webTitle: i18n.t('Receive'),
    mobileTitle: i18n.t('Receive')
  },
  [ROUTES.provider]: {
    route: ROUTES.provider,
    webTitle: i18n.t('Provider'),
    mobileTitle: i18n.t('Provider')
  },
  [ROUTES.signMessage]: {
    route: ROUTES.signMessage,
    webTitle: i18n.t('Sign Message'),
    mobileTitle: i18n.t('Sign Message')
  },
  [ROUTES.gasInformation]: {
    route: ROUTES.gasInformation,
    webTitle: i18n.t('Gas Information'),
    mobileTitle: i18n.t('Gas Information')
  },
  [ROUTES.signers]: {
    route: ROUTES.signers,
    webTitle: i18n.t('Manage Signers'),
    mobileTitle: i18n.t('Manage Signers')
  },
  [ROUTES.permissionRequest]: {
    route: ROUTES.permissionRequest,
    webTitle: i18n.t('Webpage Wants to Connect'),
    mobileTitle: i18n.t('dApp Wants to Connect')
  },
  [ROUTES.switchNetwork]: {
    route: ROUTES.switchNetwork,
    webTitle: i18n.t('Webpage Wants to Switch Network'),
    mobileTitle: i18n.t('dApp Wants to Switch Network')
  },
  [ROUTES.watchAsset]: {
    route: ROUTES.watchAsset,
    webTitle: i18n.t('Webpage Wants to Add Token'),
    mobileTitle: i18n.t('dApp Wants to Add Token')
  },
  [ROUTES.menu]: {
    route: ROUTES.menu,
    webTitle: i18n.t('Menu'),
    mobileTitle: i18n.t('Side Menu')
  },
  [ROUTES.manageVaultLock]: {
    route: ROUTES.manageVaultLock,
    webTitle: i18n.t('Manage Key Store Lock'),
    mobileTitle: i18n.t('Manage Key Store Lock')
  },
  [ROUTES.getEncryptionPublicKeyRequest]: {
    route: ROUTES.getEncryptionPublicKeyRequest,
    webTitle: i18n.t('Get Encryption Public Key Request'),
    mobileTitle: i18n.t('Get Encryption Public Key Request')
  },
  [ROUTES.dataDeletionPolicy]: {
    route: ROUTES.dataDeletionPolicy,
    webTitle: i18n.t('Data Deletion Policy'),
    mobileTitle: i18n.t('Data Deletion Policy')
  },
  [ROUTES.connect]: {
    route: ROUTES.connect,
    webTitle: i18n.t('Connect a dApp'),
    mobileTitle: i18n.t('Connect a dApp')
  },
  [ROUTES.swap]: {
    route: ROUTES.swap,
    webTitle: i18n.t('Swap'),
    mobileTitle: i18n.t('Swap')
  }
}

export default routesConfig
