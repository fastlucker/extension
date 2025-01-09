import { CARD_PREDEFINED_ID } from './cards'

const PREDEFINED_ACTION_LABEL_MAP: {
  [key: string]: string
} = {
  [CARD_PREDEFINED_ID.wheelOfFortune]: 'SPIN THE WHEEL',
  [CARD_PREDEFINED_ID.inviteAccount]: 'INVITE ADDRESS',
  [CARD_PREDEFINED_ID.linkX]: 'Link X or Farcaster',
  [CARD_PREDEFINED_ID.linkAccount]: 'Link Account'
}

export { PREDEFINED_ACTION_LABEL_MAP }
