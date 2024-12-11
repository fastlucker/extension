import { CARD_PREDEFINED_ID } from './cards'

const PREDEFINED_ACTION_LABEL_MAP: {
  [key: string]: string
} = {
  [CARD_PREDEFINED_ID.wheelOfFortune]: 'SPIN THE WHEEL',
  [CARD_PREDEFINED_ID.addEOA]: 'INVITE ADDRESS',
  [CARD_PREDEFINED_ID.linkX]: 'Link X or Farcaster',
  [CARD_PREDEFINED_ID.LinkAccount]: 'Link Account'
}

export { PREDEFINED_ACTION_LABEL_MAP }
