import React, { createContext, useMemo } from 'react'

import useAccountContext from '@legends/hooks/useAccountContext'
import useActivity from '@legends/hooks/useActivity'

import { ActivityResponse } from './types'

type ActivityContextType = {
  activity: ActivityResponse | null
  isLoading: boolean
  error: string | null
  getActivity: () => Promise<void>
}

const ActivityContext = createContext<ActivityContextType>({} as ActivityContextType)
const ActivityContextProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const { activity, isLoading, error, getActivity } = useActivity({
    page: 0,
    accountAddress: connectedAccount
  })

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
