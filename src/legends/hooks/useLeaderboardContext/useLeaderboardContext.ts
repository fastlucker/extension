import { useContext } from 'react'

import { LeaderboardContext } from '@legends/contexts/leaderboardContext'

export default function useLeaderboardContext() {
  const context = useContext(LeaderboardContext)

  if (!context) {
    throw new Error('useLeaderboardContext must be used within a LeaderboardContext')
  }

  return context
}
