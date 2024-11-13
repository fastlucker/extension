import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'

import { Activity } from './types'

type ActivityContextType = {
  activity: Activity[] | null
  isLoading: boolean
  error: string | null
  getActivity: () => Promise<void>
}

const ActivityContext = createContext<ActivityContextType>({} as ActivityContextType)
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
      setActivity(null)

      console.error(e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [connectedAccount])

  useEffect(() => {
    getActivity().catch(() =>
      setError("Couldn't fetch Character's activity! Please try again later!")
    )
  }, [getActivity])

  const contextValue = useMemo(
    () => ({
      activity,
      isLoading,
      error,
      getActivity
    }),
    [activity, isLoading, error, getActivity]
  )

  return <ActivityContext.Provider value={contextValue}>{children}</ActivityContext.Provider>
}

export { ActivityContextProvider, ActivityContext }
