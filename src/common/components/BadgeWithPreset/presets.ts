import { BadgePreset, Preset } from './types'

const BADGE_PRESETS: { [preset in Preset]: BadgePreset } = {
  'smart-account': {
    text: 'Smart Account',
    type: 'success',
    tooltipText:
      'Smart accounts enable advanced features such as enhanced gas management, transaction batching, and upgradable security.'
  },
  'basic-account': {
    text: 'Basic Account',
    type: 'warning',
    tooltipText:
      'Basic accounts grant access to basic features such as you experience with EOA (Metamask, Rabby)'
  },
  'view-only': {
    text: 'View Only',
    type: 'info',
    tooltipText: 'View-only accounts are read-only and cannot execute transactions.'
  },
  'ambire-v1': {
    text: 'Ambire v1',
    type: 'info',
    tooltipText: '...'
  },
  linked: {
    text: 'Linked',
    type: 'info',
    tooltipText: '...'
  }
}

export default BADGE_PRESETS
