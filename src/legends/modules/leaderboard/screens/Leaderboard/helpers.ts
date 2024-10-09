import { fetchCaught } from '@common/services/fetch'
import { RELAYER_URL } from '@env'
import { LeaderboardResponse } from '@legends/modules/leaderboard/types'

export const getLeaderboard = async (currentUser?: string): Promise<LeaderboardResponse> => {
  try {
    const res = await fetchCaught(
      `${RELAYER_URL}/legends/leaderboard${currentUser ? `?identity=${currentUser}` : ''}`
    )
    const body = res.body as unknown as LeaderboardResponse

    if (!body?.leaderboard) throw new Error('Invalid response')

    return body
  } catch (e) {
    console.error('Error fetching leaderboard', e)
    return {
      leaderboard: [],
      currentUser: { image: '', image_avatar: '', rank: 0, account: '', xp: 0, level: 0 }
    }
  }
}
