type XpReward = {
  label: string
  value: number
}

type CardAction = {
  label: string
  onClick: () => void
}

type Card = {
  heading: string
  image: string
  xpRewards: XpReward[]
  description: string
  repeatable?: boolean
  completed?: boolean
  action?: CardAction
}

export type { Card, CardAction, XpReward }
