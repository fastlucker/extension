import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'

type Activity = {
  txId: string
  network: string
  submittedAt: string
  txns: [[]]
  legends: {
    activities: {
      action: string
      xp: number
    }[]
    totalXp: number
  }
}

const ActivityContext = createContext<{
  activity: Activity[] | null
  isLoading: boolean
}>({
  activity: null,
  isLoading: false
})
const ActivityContextProvider: React.FC<any> = ({ children }) => {
  const { lastConnectedV2Account } = useAccountContext()
  const [activity, setActivity] = useState<Activity[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getActivity = useCallback(async () => {
    if (!lastConnectedV2Account) {
      setActivity(null)
      setIsLoading(false)
      return
    }

    const activityResponse = await fetch(
      `${RELAYER_URL}/legends/activity/${lastConnectedV2Account}`
    )

    setIsLoading(false)
    setActivity(await activityResponse.json())
  }, [lastConnectedV2Account])

  useEffect(() => {
    getActivity()
  }, [getActivity])

  return (
    <ActivityContext.Provider
      value={useMemo(
        () => ({
          activity,
          isLoading
        }),
        [activity, isLoading]
      )}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export { ActivityContextProvider, ActivityContext }
