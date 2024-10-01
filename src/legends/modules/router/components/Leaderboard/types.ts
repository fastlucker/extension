export interface LeaderboardResponse {
  leaderboard: Array<{ rank: number; account: string; level: number; xp: number; avatar: string }>
  currentUser: { rank: number; account: string; xp: number; level: number }
}
