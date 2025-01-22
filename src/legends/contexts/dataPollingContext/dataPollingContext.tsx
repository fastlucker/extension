import React, { createContext, useEffect, useMemo, useRef } from 'react'

import useCharacterContext from '@legends/hooks/useCharacterContext'
import useActivityContext from '@legends/hooks/useActivityContext'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

type DataPollingContextType = {}

const DataPollingContext = createContext<DataPollingContextType>({} as DataPollingContextType)

const POLLING_INTERVAL = 60000 // 1 min
// Defines the minimum time interval that must pass since the last refresh
// before triggering a new update when switching from an inactive to an active tab.
// Ensures that contexts are refreshed immediately but avoids redundant updates if the last refresh was recent.
const VISIBLE_TAB_MIN_CACHE_TIME = 10000 // 10 sec

// A common context for auto polling and updating the app state.
// On every POLLING_INTERVAL, it updates the app state by calling the get methods of the contexts we have.
// When the tab is hidden, we stop the timer/updates to avoid making unnecessary calls to the API.
// Once the tab becomes active, we update the app state (if it hasn't been updated in the last VISIBLE_TAB_MIN_CACHE_TIME seconds).
const DataPollingContextProvider: React.FC<any> = ({ children }) => {
  const { getActivity } = useActivityContext()
  const { getCharacter } = useCharacterContext()
  const { updateLeaderboard } = useLeaderboardContext()
  const { getLegends } = useLegendsContext()
  const { updateAccountPortfolio } = usePortfolioControllerState()

  const pollingIntervalRef: any = useRef(null)
  const lastPollReceivedAtRef: any = useRef(null)
  const startPollingRef = useRef(() => {})

  // We use the `useRef` pattern instead of `useCallback` to create the `startPollingRef.current` function for better performance.
  // Using `useCallback` would require adding it as a dependency in the next `useEffect` (where we schedule the timer),
  // which would cause the polling logic to reinitialize whenever a context is updated—something we want to avoid.
  // By storing the polling function in startPollingRef.current, its dependencies remain up to date
  // as the reference is updated whenever a dependency changes, without causing re-renders.
  useEffect(() => {
    startPollingRef.current = async () => {
      try {
        await Promise.all([
          getCharacter(),
          getActivity(),
          updateLeaderboard(),
          getLegends(),
          updateAccountPortfolio()
        ])

        lastPollReceivedAtRef.current = Date.now()
      } catch (error) {
        // For now, in case of a context update failure during polling, we simply reschedule the next polling,
        // as each context has its own error handling.
        console.error('An error occurred while polling the latest character data:', error)
      }

      pollingIntervalRef.current = setTimeout(startPollingRef.current, POLLING_INTERVAL)
    }
  }, [getCharacter, getActivity, updateLeaderboard, getLegends, updateAccountPortfolio])

  useEffect(() => {
    // Schedule initial polling
    pollingIntervalRef.current = setTimeout(startPollingRef.current, POLLING_INTERVAL)
    // On initial load, we assume that the data has already been fetched from other contexts,
    // which is why we set the `receivedAt` timestamp.
    lastPollReceivedAtRef.current = Date.now()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh data immediately when the tab becomes active if `VISIBLE_TAB_MIN_CACHE_TIME` has passed.
        // Otherwise, schedule the next update using `POLLING_INTERVAL`.
        const timeout =
          Date.now() - lastPollReceivedAtRef.current > VISIBLE_TAB_MIN_CACHE_TIME
            ? 0
            : POLLING_INTERVAL
        pollingIntervalRef.current = setTimeout(startPollingRef.current, timeout)
      } else {
        // Stop polling, when the tab is hidden
        clearTimeout(pollingIntervalRef.current)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(pollingIntervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const contextValue = useMemo(() => ({}), [])

  return <DataPollingContext.Provider value={contextValue}>{children}</DataPollingContext.Provider>
}

export { DataPollingContextProvider, DataPollingContext }
