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
  action: {
    type: CardActionType
    calls?: [string, string, string][]
    predefinedId?: string
  }
  card: {
    type: CardType
  }
  image: string
}
