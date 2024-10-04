export enum CardXpType {
  'global',
  'mainnet',
  'l2'
}

export enum CardActionType {
  'none',
  'calls',
  'predefined'
}

export interface CardAction {
  type: CardActionType
  calls?: [string, string, string][]
  predefinedId?: string
}

export enum CardType {
  'recurring',
  'done',
  'available'
}

export interface CardXp {
  type: CardXpType
  from: number
  to: number
  minUsdThreshold: number
}

export interface CardFromResponse {
  title: string
  description: string
  xp: CardXp[]
  action: CardAction
  card: {
    type: CardType
  }
  image: string
}
