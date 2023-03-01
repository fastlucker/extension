import { Platform } from 'react-native'

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
    title: string
  }
} = {
  [ROUTES.unlockVault]: {
    route: ROUTES.unlockVault,
    title: Platform.select({
      default: i18n.t('Welcome Back')
    })
  },
  [ROUTES.resetVault]: {
    route: ROUTES.resetVault,
    title: Platform.select({
      web: i18n.t('Reset your\nAmbire Key Store Lock'),
      default: i18n.t('Reset Ambire Key Store')
    })
  },
  [ROUTES.noConnection]: {
    route: ROUTES.noConnection,
    title: Platform.select({
      default: i18n.t('No Connection')
    })
  },
  [ROUTES.getStarted]: {
    route: ROUTES.getStarted,
    title: Platform.select({
      default: i18n.t('Welcome')
    })
  },
  [ROUTES.createVault]: {
    route: ROUTES.createVault,
    title: Platform.select({
      default: i18n.t('Setup Your Ambire Key Store')
    })
  },
  [ROUTES.auth]: {
    route: ROUTES.auth,
    title: Platform.select({
      web: i18n.t('Welcome to\nAmbire Wallet Extension'),
      default: i18n.t('Welcome to Ambire')
    })
  },
  [ROUTES.ambireAccountLogin]: {
    route: ROUTES.ambireAccountLogin,
    title: Platform.select({
      default: i18n.t('Login')
    })
  },
  [ROUTES.ambireAccountLoginPasswordConfirm]: {
    route: ROUTES.ambireAccountLoginPasswordConfirm,
    title: Platform.select({
      web: i18n.t('Confirm Account Password'),
      default: i18n.t('Login')
    })
  },
  [ROUTES.ambireAccountJsonLogin]: {
    route: ROUTES.ambireAccountJsonLogin,
    title: Platform.select({
      default: i18n.t('Import from JSON')
    })
  },
  [ROUTES.ambireAccountJsonLoginPasswordConfirm]: {
    route: ROUTES.ambireAccountJsonLoginPasswordConfirm,
    title: Platform.select({
      web: i18n.t('Confirm Account Password'),
      default: i18n.t('Login')
    })
  },
  [ROUTES.qrCodeLogin]: {
    route: ROUTES.qrCodeLogin,
    title: Platform.select({
      default: i18n.t('Import with QR Code')
    })
  },
  [ROUTES.hardwareWallet]: {
    route: ROUTES.hardwareWallet,
    title: Platform.select({
      default: i18n.t('Login with Hardware Wallet')
    })
  },
  [ROUTES.externalSigner]: {
    route: ROUTES.externalSigner,
    title: Platform.select({
      default: i18n.t('Login with External Signer')
    })
  },
  [ROUTES.dashboard]: {
    route: ROUTES.dashboard,
    title: Platform.select({
      default: i18n.t('Dashboard')
    })
  },
  [ROUTES.collectibles]: {
    route: ROUTES.collectibles,
    title: Platform.select({
      default: i18n.t('Collectibles')
    })
  },
  [ROUTES.earn]: {
    route: ROUTES.earn,
    title: Platform.select({
      default: i18n.t('Earn')
    })
  },
  [ROUTES.send]: {
    route: ROUTES.send,
    title: Platform.select({
      default: i18n.t('Send')
    })
  },
  [ROUTES.transactions]: {
    route: ROUTES.transactions,
    title: Platform.select({
      default: i18n.t('Transactions')
    })
  },
  [ROUTES.gasTank]: {
    route: ROUTES.gasTank,
    title: Platform.select({
      default: i18n.t('Gas Tank')
    })
  },
  [ROUTES.pendingTransactions]: {
    route: ROUTES.pendingTransactions,
    title: Platform.select({
      default: i18n.t('Pending Transactions')
    })
  },
  [ROUTES.receive]: {
    route: ROUTES.receive,
    title: Platform.select({
      default: i18n.t('Receive')
    })
  },
  [ROUTES.provider]: {
    route: ROUTES.provider,
    title: Platform.select({
      default: i18n.t('Provider')
    })
  },
  [ROUTES.signMessage]: {
    route: ROUTES.signMessage,
    title: Platform.select({
      default: i18n.t('Sign Message')
    })
  },
  [ROUTES.gasInformation]: {
    route: ROUTES.gasInformation,
    title: Platform.select({
      default: i18n.t('Gas Information')
    })
  },
  [ROUTES.signers]: {
    route: ROUTES.signers,
    title: Platform.select({
      default: i18n.t('Manage Signers')
    })
  },
  [ROUTES.permissionRequest]: {
    route: ROUTES.permissionRequest,
    title: Platform.select({
      web: i18n.t('Webpage Wants to Connect'),
      default: i18n.t('dApp Wants to Connect')
    })
  },
  [ROUTES.switchNetwork]: {
    route: ROUTES.switchNetwork,
    title: Platform.select({
      web: i18n.t('Webpage Wants to Switch Network'),
      default: i18n.t('dApp Wants to Switch Network')
    })
  },
  [ROUTES.watchAsset]: {
    route: ROUTES.watchAsset,
    title: Platform.select({
      web: i18n.t('Webpage Wants to Add Token'),
      default: i18n.t('dApp Wants to Add Token')
    })
  },
  [ROUTES.menu]: {
    route: ROUTES.menu,
    title: Platform.select({
      web: i18n.t('Menu'),
      default: i18n.t('Side Menu')
    })
  },
  [ROUTES.manageVaultLock]: {
    route: ROUTES.manageVaultLock,
    title: Platform.select({
      default: i18n.t('Manage Key Store Lock')
    })
  },
  [ROUTES.getEncryptionPublicKeyRequest]: {
    route: ROUTES.getEncryptionPublicKeyRequest,
    title: Platform.select({
      default: i18n.t('Get Encryption Public Key Request')
    })
  },
  [ROUTES.dataDeletionPolicy]: {
    route: ROUTES.dataDeletionPolicy,
    title: Platform.select({
      default: i18n.t('Data Deletion Policy')
    })
  },
  [ROUTES.connect]: {
    route: ROUTES.connect,
    title: Platform.select({
      default: i18n.t('Connect a dApp')
    })
  },
  [ROUTES.swap]: {
    route: ROUTES.swap,
    title: Platform.select({
      default: i18n.t('Swap')
    })
  }
}

export default routesConfig
