export enum ROTES {
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
  [ROTES.unlockVault]: {
    route: ROTES.unlockVault,
    title: 'Welcome Back'
  },
  [ROTES.resetVault]: {
    route: ROTES.resetVault,
    title: 'Reset your\nAmbire Key Store Lock'
  },
  [ROTES.noConnection]: {
    route: ROTES.noConnection,
    title: 'No Connection'
  },
  [ROTES.getStarted]: {
    route: ROTES.getStarted,
    title: 'Welcome'
  },
  [ROTES.createVault]: {
    route: ROTES.createVault,
    title: 'Setup Your Ambire Key Store'
  },
  [ROTES.auth]: {
    route: ROTES.auth,
    title: 'Welcome to\nAmbire Wallet Extension'
  },
  [ROTES.ambireAccountLogin]: {
    route: ROTES.ambireAccountLogin,
    title: 'Login'
  },
  [ROTES.ambireAccountLoginPasswordConfirm]: {
    route: ROTES.ambireAccountLoginPasswordConfirm,
    title: 'Confirm Account Password'
  },
  [ROTES.ambireAccountJsonLogin]: {
    route: ROTES.ambireAccountJsonLogin,
    title: 'Import from JSON'
  },
  [ROTES.ambireAccountJsonLoginPasswordConfirm]: {
    route: ROTES.ambireAccountJsonLoginPasswordConfirm,
    title: 'Confirm Account Password'
  },
  [ROTES.qrCodeLogin]: {
    route: ROTES.qrCodeLogin,
    title: 'Import with QR Code'
  },
  [ROTES.hardwareWallet]: {
    route: ROTES.hardwareWallet,
    title: 'Login with Hardware Wallet'
  },
  [ROTES.externalSigner]: {
    route: ROTES.externalSigner,
    title: 'Login with External Signer'
  },
  [ROTES.dashboard]: {
    route: ROTES.dashboard,
    title: 'Dashboard'
  },
  [ROTES.collectibles]: {
    route: ROTES.collectibles,
    title: 'Collectibles'
  },
  [ROTES.earn]: {
    route: ROTES.earn,
    title: 'Earn'
  },
  [ROTES.send]: {
    route: ROTES.send,
    title: 'Send'
  },
  [ROTES.transactions]: {
    route: ROTES.transactions,
    title: 'Transactions'
  },
  [ROTES.gasTank]: {
    route: ROTES.gasTank,
    title: 'Gas Tank'
  },
  [ROTES.pendingTransactions]: {
    route: ROTES.pendingTransactions,
    title: 'Pending Transactions'
  },
  [ROTES.receive]: {
    route: ROTES.receive,
    title: 'Receive'
  },
  [ROTES.provider]: {
    route: ROTES.provider,
    title: 'Provider'
  },
  [ROTES.signMessage]: {
    route: ROTES.signMessage,
    title: 'Sign Message'
  },
  [ROTES.gasInformation]: {
    route: ROTES.gasInformation,
    title: 'Gas Information'
  },
  [ROTES.signers]: {
    route: ROTES.signers,
    title: 'Manage Signers'
  },
  [ROTES.permissionRequest]: {
    route: ROTES.permissionRequest,
    title: 'Webpage Wants to Connect'
  },
  [ROTES.switchNetwork]: {
    route: ROTES.switchNetwork,
    title: 'Webpage Wants to Switch Network'
  },
  [ROTES.watchAsset]: {
    route: ROTES.watchAsset,
    title: 'Webpage Wants to Add Token'
  },
  [ROTES.menu]: {
    route: ROTES.menu,
    title: 'Menu'
  },
  [ROTES.manageVaultLock]: {
    route: ROTES.manageVaultLock,
    title: 'Manage Key Store Lock'
  },
  [ROTES.getEncryptionPublicKeyRequest]: {
    route: ROTES.getEncryptionPublicKeyRequest,
    title: 'Get Encryption Public Key Request'
  },
  [ROTES.dataDeletionPolicy]: {
    route: ROTES.dataDeletionPolicy,
    title: 'Data Deletion Policy'
  },
  [ROTES.connect]: {
    route: ROTES.connect,
    title: 'Connect a dApp'
  },
  [ROTES.swap]: {
    route: ROTES.swap,
    title: 'Swap'
  }
}

export default routesConfig
