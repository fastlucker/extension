export type Activity = {
  txId: string
  network: string
  submittedAt: string
  txns: [[]]
  legends: {
    activities: {
      action: string
      xp: number
    }[]
    totalXp: number
  }
}

export type LegendActivity = Activity['legends']['activities'][0]
