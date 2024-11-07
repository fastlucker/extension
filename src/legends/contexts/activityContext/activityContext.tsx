import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'

import { Activity } from './types'

const ActivityContext = createContext<{
  activity: Activity[] | null
  isLoading: boolean
  error: string | null
  getActivity: () => void
}>({
  activity: null,
  isLoading: false,
  error: null,
  getActivity: () => {}
})
const ActivityContextProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const [activity, setActivity] = useState<Activity[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getActivity = useCallback(async () => {
    try {
      const activityResponse = await fetch(`${RELAYER_URL}/legends/activity/${connectedAccount}`)

      const response = await activityResponse.json()

      setActivity(response)
      setError(null)
    } catch (e) {
      setIsLoading(false)
      setActivity(null)

      console.error(e)
      setError("Couldn't fetch Character's activity! Please try again later!")
    }

    setIsLoading(false)
  }, [connectedAccount])

  useEffect(() => {
    getActivity()
  }, [getActivity])

  return (
    <ActivityContext.Provider
      value={useMemo(
        () => ({
          activity,
          isLoading,
          error,
          getActivity
        }),
        [activity, isLoading, error, getActivity]
      )}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export { ActivityContextProvider, ActivityContext }
