import React, { createContext, useMemo } from 'react'

import useAccountContext from '@legends/hooks/useAccountContext'
import useActivity from '@legends/hooks/useActivity'

import { ActivityResponse } from './types'

type RecentActivityContextType = {
  activity: ActivityResponse | null
  isLoading: boolean
  error: string | null
  getActivity: () => Promise<ActivityResponse | null>
}

const RecentActivityContext = createContext<RecentActivityContextType>(
  {} as RecentActivityContextType
)
const RecentActivityContextProvider: React.FC<any> = ({ children }) => {
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

  return (
    <RecentActivityContext.Provider value={contextValue}>{children}</RecentActivityContext.Provider>
  )
}

export { RecentActivityContextProvider, RecentActivityContext }
