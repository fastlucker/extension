import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import usePrevious from '@common/hooks/usePrevious'
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

const ACTIVITY_UPDATE_INTERVAL = 90000

const RecentActivityContextProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const { activity, isLoading, error, getActivity } = useActivity({
    page: 0,
    accountAddress: connectedAccount
  })
  const prevActivity = usePrevious(activity)
  const [shouldGetOnFocus, setShouldGetOnFocus] = useState(false)
  const getActivityIntervalRef: any = useRef(null)

  const runActivityContinuousUpdate = useCallback(async () => {
    if (!document.hidden) {
      await getActivity()
      getActivityIntervalRef.current = setTimeout(
        runActivityContinuousUpdate,
        ACTIVITY_UPDATE_INTERVAL
      )
    } else {
      setShouldGetOnFocus(true)
    }
  }, [getActivity])

  useEffect(() => {
    if (!prevActivity && !!activity && !getActivityIntervalRef.current) {
      // init the interval
      getActivityIntervalRef.current = setTimeout(
        runActivityContinuousUpdate,
        ACTIVITY_UPDATE_INTERVAL
      )
    }

    return () => {
      clearTimeout(getActivityIntervalRef.current)
    }
  }, [getActivity, runActivityContinuousUpdate, activity, prevActivity])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldGetOnFocus) {
        setShouldGetOnFocus(false)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        runActivityContinuousUpdate()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [runActivityContinuousUpdate, shouldGetOnFocus])

  const contextValue = useMemo(
    () => ({ activity, isLoading, error, getActivity }),
    [activity, isLoading, error, getActivity]
  )

  return (
    <RecentActivityContext.Provider value={contextValue}>{children}</RecentActivityContext.Provider>
  )
}

export { RecentActivityContextProvider, RecentActivityContext }
