import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  calculateLastMidnight,
  calculateTimeToMidnight,
  getHoursAndMinutesLabel,
  getHoursLabel,
  getMinutesLabel
} from './helpers'

export type MidnightTimerType = {
  hoursLabel: string
  minutesLabel: string
  hoursAndMinutesLabel: string
  hasMidnightOccurred: boolean
  startTimer: (forceStart: boolean) => void
  stopTimer: () => void
}

// A hook that counts down every minute until midnight.
// The hook outputs two labels (`hoursLabel` and `minutesLabel`), depending on how you want to visualize the time left in your component.
// Once midnight is reached, it sets the `hasMidnightOccurred` flag to `true` and stops the timer.
// This approach is used to allow the app to update when midnight occurs.
// Once the timer is stopped, it can be rescheduled simply by invoking `startTimer()`.
export default function useUtcMidnightTimer(): MidnightTimerType {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeToMidnight())
  const timeoutId: any = useRef(null)
  const lastMidnight = useRef(calculateLastMidnight())

  const hoursLabel = useMemo(() => getHoursLabel(timeRemaining), [timeRemaining])
  const minutesLabel = useMemo(() => getMinutesLabel(timeRemaining), [timeRemaining])
  const hoursAndMinutesLabel = useMemo(() => getHoursAndMinutesLabel(timeRemaining), [timeRemaining])
  const hasMidnightOccurred = useMemo(() => timeRemaining === 0, [timeRemaining])

  const stopTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
  }, [])

  // `forceUpdate` will forcefully recalculate the remaining time until midnight,
  // update the hook's internal state, and schedule the next timer update.
  // This is helpful when we stop the timer (e.g., inactive tab)
  // and want to recalculate and reschedule the timer (e.g., when the tab becomes active).
  const startTimer = useCallback(
    (forceUpdate = false) => {
      const updateTimer = () => {
        const now = Date.now()

        // Check if midnight has occurred
        const day = 24 * 60 * 60 * 1000
        if (now >= lastMidnight.current + day) {
          lastMidnight.current = calculateLastMidnight()
          // Ensure remainingTime is set to 0 at midnight
          setTimeRemaining(0)
          // Stop the timer when midnight has occurred
          stopTimer()
          return
        }

        // Calculate remaining time
        const remainingTime = calculateTimeToMidnight()
        setTimeRemaining(remainingTime)

        // Schedule the next execution
        timeoutId.current = setTimeout(updateTimer, 60000 - (Date.now() % 60000))
      }

      // Schedule the first execution
      timeoutId.current = setTimeout(updateTimer, forceUpdate ? 0 : 60000 - (Date.now() % 60000))
    },
    [stopTimer]
  )

  useEffect(() => {
    startTimer()

    return () => {
      // Cleanup on component unmount
      stopTimer()
    }
  }, [startTimer, stopTimer])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer()
      } else {
        startTimer(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopTimer() // Cleanup on component unmount
    }
  }, [startTimer, stopTimer])

  return { hoursLabel, minutesLabel,hoursAndMinutesLabel, hasMidnightOccurred, startTimer, stopTimer }
}
