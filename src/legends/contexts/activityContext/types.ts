export type Activity = {
  txId: string
  network: string
  submittedAt: string
  txns: { id: string; amount: number; status: string }[][] | null
  activities: LegendActivity[]
  totalXp: number
}
export type LegendActivity = {
  action: string
  xp: number
}

