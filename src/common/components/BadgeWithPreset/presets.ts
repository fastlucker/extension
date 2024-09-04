import { BadgePreset, Preset } from './types'

const BADGE_PRESETS: { [preset in Preset]: BadgePreset } = {
  'smart-account': {
    text: 'Smart Account',
    type: 'success',
    tooltipText:
      'Smart Account includes many advanced security features, such as account recovery, paying transaction fees in stablecoins, performing multiple actions in one transaction (transaction batching), and more.'
  },
  'basic-account': {
    text: 'Basic Account',
    type: 'warning',
    tooltipText:
      'Basic Accounts, also known as EOAs (Externally Owned Accounts), provide basic functionalities only.'
  },
  'view-only': {
    text: 'View-only',
    type: 'info',
    tooltipText:
      'The "View-only" account is imported without signer keys, meaning you can see its balances, connect it with dApps, simulate transactions, and more, but you cannot control it or sign transactions or messages.'
  },
  'ambire-v1': {
    text: 'Ambire v1',
    type: 'info',
    tooltipText:
      'Smart Accounts created with the Web or Mobile platforms of Ambire Wallet. You can sign transactions (single and batched ones), connect with dApps, and more, but cannot utilize all the features and functionalities of the Ambire Wallet extension.'
  },
  linked: {
    text: 'Linked',
    type: 'info',
    tooltipText:
      'Smart Accounts were initially created with a given signer key, but another signer key is authorized for that account on one or more of the supported networks.'
  }
}

export default BADGE_PRESETS
