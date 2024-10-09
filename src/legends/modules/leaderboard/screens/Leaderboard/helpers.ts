import { fetchCaught } from '@common/services/fetch'
import { RELAYER_URL } from '@env'

import { LeaderboardResponse } from './types'

export const getLeaderboard = async (currentUser?: string): Promise<LeaderboardResponse> => {
  try {
    const res = await fetchCaught(
      `${RELAYER_URL}/legends/leaderboard${currentUser ? `?identity=${currentUser}` : ''}`
    )
    const body = res.body as unknown as LeaderboardResponse

    if (!body?.leaderboard) throw new Error('Invalid response')

    return body
  } catch {
    console.error('Error fetching leaderboard')
    return { leaderboard: [], currentUser: { avatar: '', rank: 0, account: '', xp: 0, level: 0 } }
  }
}
