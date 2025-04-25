type LeaderboardEntry = {
  rank: number
  account: string
  level: number
  xp: number
  weight: number
  image: string
  image_avatar: string
}

interface LeaderboardResponse {
  leaderboard: Array<LeaderboardEntry>
  currentUser: LeaderboardEntry
}

export type { LeaderboardEntry, LeaderboardResponse }
