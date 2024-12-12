import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useAccountContext from '@legends/hooks/useAccountContext'
import { LeaderboardEntry } from '@legends/modules/leaderboard/types'

import { getLeaderboard } from './helpers'

type LeaderboardContextType = {
  isLeaderboardLoading: boolean
  leaderboardData: Array<LeaderboardEntry>
  userLeaderboardData: LeaderboardEntry | null
  error: string | null
  updateLeaderboard: () => Promise<void>
}

const LeaderboardContext = createContext<LeaderboardContextType>({} as LeaderboardContextType)

const LeaderboardContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<Array<LeaderboardEntry>>([])
  const [userLeaderboardData, setUserLeaderboardData] = useState<LeaderboardEntry | null>(null)
  const { connectedAccount } = useAccountContext()

  const updateLeaderboard = useCallback(async () => {
    try {
      setError(null)
      const response = await getLeaderboard(connectedAccount ?? undefined)

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
  }, [connectedAccount])

  useEffect(() => {
    updateLeaderboard()
  }, [connectedAccount, updateLeaderboard])

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
      error,
      updateLeaderboard
    }),
    [loading, sortedData, userLeaderboardData, error, updateLeaderboard]
  )

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>
}

export { LeaderboardContext, LeaderboardContextProvider }
