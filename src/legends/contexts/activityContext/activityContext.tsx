import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'

import { Activity } from './types'

const ActivityContext = createContext<{
  activity: Activity[] | null
  isLoading: boolean
  error: string | null
}>({
  activity: null,
  isLoading: false,
  error: null
})
const ActivityContextProvider: React.FC<any> = ({ children }) => {
  const { lastConnectedV2Account } = useAccountContext()
  const [activity, setActivity] = useState<Activity[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getActivity = useCallback(async () => {
    if (!lastConnectedV2Account) {
      setActivity(null)
      setIsLoading(false)
      return
    }

    try {
      const activityResponse = await fetch(
        `${RELAYER_URL}/legends/activity/${lastConnectedV2Account}`
      )

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
  }, [lastConnectedV2Account])

  useEffect(() => {
    getActivity()
  }, [getActivity])

  return (
    <ActivityContext.Provider
      value={useMemo(
        () => ({
          activity,
          isLoading,
          error
        }),
        [activity, isLoading, error]
      )}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export { ActivityContextProvider, ActivityContext }
