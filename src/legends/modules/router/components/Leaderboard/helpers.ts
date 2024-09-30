import { fetchCaught } from '@common/services/fetch'

import { LeaderboardResponse } from './Leaderboard'

export const getLeaderboard = async (currentUser?: string): Promise<LeaderboardResponse> => {
  try {
    const res = await fetchCaught(
      `https://staging-relayer.ambire.com/legends/leaderboard${
        currentUser ? `?identity=${currentUser}` : ''
      }`
    )
    return res.body
  } catch {
    console.error('Error fetching leaderboard')
    return { leaderboard: [], currentUser: { rank: 0, account: '', xp: 0, level: 0 } }
  }
}
