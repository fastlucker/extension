import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  calculateTimeToMidnight,
  calculateLastMidnight,
  getHoursLabel,
  getMinutesLabel
} from './helpers'

export type MidnightTimerType = {
  hoursLabel: string
  minutesLabel: string
  hasMidnightOccurred: boolean
  startTimer: (forceStart: boolean) => void
  stopTimer: () => void
}

export default function useUtcMidnightTimer(): MidnightTimerType {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeToMidnight())
  const timeoutId: any = useRef(null)
  const lastMidnight = useRef(calculateLastMidnight())

  const hoursLabel = useMemo(() => getHoursLabel(timeRemaining), [timeRemaining])
  const minutesLabel = useMemo(() => getMinutesLabel(timeRemaining), [timeRemaining])
  const hasMidnightOccurred = useMemo(() => timeRemaining === 0, [timeRemaining])

  const stopTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
  }, [])

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
        startTimer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopTimer() // Cleanup on component unmount
    }
  }, [startTimer, stopTimer])

  return { hoursLabel, minutesLabel, hasMidnightOccurred, startTimer, stopTimer }
}
