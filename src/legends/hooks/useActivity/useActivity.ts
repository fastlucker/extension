import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { RELAYER_URL } from '@env'
import { ActivityResponse } from '@legends/contexts/recentActivityContext/types'

type Props = {
  page: number
  accountAddress: string | null
}

const useActivity = ({ page, accountAddress }: Props) => {
  const [activity, setActivity] = useState<ActivityResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const getActivityIntervalRef: any = useRef(null)
  const [shouldGetOnFocus, setShouldGetOnFocus] = useState(false)
  const activityUpdateInterval = useMemo(() => (page === 0 ? 90000 : 300000), [page])
  const getActivity = useCallback(async () => {
    if (!accountAddress) return null

    // Ensure there isn't already a scheduled timeout before setting a new one.
    if (getActivityIntervalRef.current) clearTimeout(getActivityIntervalRef.current)

    try {
      const activityResponse = await fetch(
        `${RELAYER_URL}/legends/activity/${accountAddress}?page=${page}`
      )
      if (!activityResponse.ok) {
        throw new Error('Failed to fetch Character activity!')
      }

      const response = await activityResponse.json()

      setActivity(response)
      setError(null)

      return response as ActivityResponse
    } catch (e) {
      setActivity(null)

      console.error(e)
      throw e
    } finally {
      setIsLoading(false)
      const runActivityContinuousUpdate = async () => {
        if (!document.hidden) {
          await getActivity()
        } else {
          setShouldGetOnFocus(true)
        }

        getActivityIntervalRef.current = setTimeout(
          runActivityContinuousUpdate,
          activityUpdateInterval
        )
      }

      getActivityIntervalRef.current = setTimeout(
        runActivityContinuousUpdate,
        activityUpdateInterval
      )
    }
  }, [accountAddress, page, activityUpdateInterval])

  // call get on init
  useEffect(() => {
    getActivity().catch(() =>
      setError("Couldn't fetch Character's activity! Please try again later!")
    )

    return () => {
      clearTimeout(getActivityIntervalRef.current)
    }
  }, [getActivity])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldGetOnFocus) {
        setShouldGetOnFocus(false)
        getActivity().catch(() => {
          if (!activity) {
            setError("Couldn't fetch Character's activity! Please try again later!")
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [activity, getActivity, shouldGetOnFocus])

  return {
    activity,
    isLoading,
    error,
    getActivity
  }
}

export default useActivity
