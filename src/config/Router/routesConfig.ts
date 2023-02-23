const routesConfig: {
  [key: string]: {
    route: string
    title: string
  }
} = {
  'unlock-vault': {
    route: 'unlock-vault',
    title: 'Welcome Back'
  },
  'reset-vault': {
    route: 'reset-vault',
    title: 'Reset your\nAmbire Key Store Lock'
  },
  'no-connection': {
    route: 'no-connection',
    title: 'No Connection'
  },
  'get-started': {
    route: 'get-started',
    title: 'Welcome'
  },
  'create-vault': {
    route: 'create-vault',
    title: 'Setup Your Ambire Key Store'
  },
  auth: {
    route: 'auth',
    title: 'Welcome to\nAmbire Wallet Extension'
  },
  'ambire-account-login': {
    route: 'ambire-account-login',
    title: 'Login'
  },
  'ambire-account-login-password-confirm': {
    route: 'ambire-account-login-password-confirm',
    title: 'Confirm Account Password'
  },
  'ambire-account-json-login': {
    route: 'ambire-account-json-login',
    title: 'Import from JSON'
  },
  'ambire-account-json-login-password-confirm': {
    route: 'ambire-account-json-login-password-confirm',
    title: 'Confirm Account Password'
  },
  'qr-code-login': {
    route: 'qr-code-login',
    title: 'Import with QR Code'
  },
  'hardware-wallet': {
    route: 'hardware-wallet',
    title: 'Login with Hardware Wallet'
  },
  'external-signer': {
    route: 'external-signer',
    title: 'Login with External Signer'
  },
  dashboard: {
    route: 'dashboard',
    title: 'Dashboard'
  },
  collectibles: {
    route: 'collectibles',
    title: 'Collectibles'
  },
  earn: {
    route: 'earn',
    title: 'Earn'
  },
  send: {
    route: 'send',
    title: 'Send'
  },
  transactions: {
    route: 'transactions',
    title: 'Transactions'
  },
  'gas-tank': {
    route: 'gas-tank',
    title: 'Gas Tank'
  },
  'pending-transactions': {
    route: 'pending-transactions',
    title: 'Pending Transactions'
  },
  receive: {
    route: 'receive',
    title: 'Receive'
  },
  provider: {
    route: 'provider',
    title: 'Provider'
  },
  'sign-message': {
    route: 'sign-message',
    title: 'Sign Message'
  },
  'gas-information': {
    route: 'gas-information',
    title: 'Gas Information'
  }
}

export default routesConfig
