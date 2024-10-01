import { fetchCaught } from '@common/services/fetch'

import { LeaderboardResponse } from './types'

export const getLeaderboard = async (currentUser?: string): Promise<LeaderboardResponse> => {
  try {
    const res = await fetchCaught(
      `https://staging-relayer.ambire.com/legends/leaderboard${
        currentUser ? `?identity=${currentUser}` : ''
      }`
    )
    const body = res.body as unknown as LeaderboardResponse

    if (!body?.leaderboard || !body?.currentUser) throw new Error('Invalid response')

    return body
  } catch {
    console.error('Error fetching leaderboard')
    return { leaderboard: [], currentUser: { rank: 0, account: '', xp: 0, level: 0 } }
  }
}
