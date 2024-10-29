import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccountContext from '@legends/hooks/useAccountContext'
import { LeaderboardEntry } from '@legends/modules/leaderboard/types'

import { getLeaderboard } from './helpers'

type LeaderboardContextType = {
  isLeaderboardLoading: boolean
  leaderboardData: Array<LeaderboardEntry>
  userLeaderboardData: LeaderboardEntry | null
  error: string | null
}

const LeaderboardContext = createContext<LeaderboardContextType>({
  isLeaderboardLoading: true,
  leaderboardData: [],
  userLeaderboardData: null,
  error: null
})

const LeaderboardContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<Array<LeaderboardEntry>>([])
  const [userLeaderboardData, setUserLeaderboardData] = useState<LeaderboardEntry | null>(null)
  const { lastConnectedV2Account } = useAccountContext()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError(null)
        const response = await getLeaderboard(lastConnectedV2Account ?? undefined)

        if (response) {
          const { leaderboard, currentUser } = response
          setLeaderboardData(leaderboard)
          currentUser && setUserLeaderboardData(currentUser)
        } else {
          setError('Failed to fetch leaderboard')
        }
      } catch (e) {
        console.error('Failed to fetch leaderboard:', e)
        setError('Failed to fetch leaderboard')
        throw e
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [lastConnectedV2Account])

  const sortedData = useMemo(
    () =>
      [
        ...leaderboardData,
        (userLeaderboardData &&
          !leaderboardData.find((user) => user.account === userLeaderboardData.account) &&
          userLeaderboardData) ||
          []
      ]
        .flat()
        .sort((a, b) => b.xp - a.xp),
    [leaderboardData, userLeaderboardData]
  )

  const value: LeaderboardContextType = useMemo(
    () => ({
      isLeaderboardLoading: loading,
      leaderboardData: sortedData,
      userLeaderboardData,
      error
    }),
    [loading, sortedData, userLeaderboardData, error]
  )

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>
}

export { LeaderboardContext, LeaderboardContextProvider }
