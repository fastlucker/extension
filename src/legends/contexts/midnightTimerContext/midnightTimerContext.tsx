import React, { createContext, useEffect, useMemo } from 'react'

import useLegendsContext from '@legends/hooks/useLegendsContext'
import useToast from '@legends/hooks/useToast'
import useUtcMidnightTimer, {
  MidnightTimerType
} from '@legends/hooks/useUtcMidnightTimer/useUtcMidnightTimer'

const MidnightTimerContext = createContext<MidnightTimerType>({
  hoursLabel: '',
  minutesLabel: '',
  hoursAndMinutesLabel: '',
  hasMidnightOccurred: false,
  startTimer: () => {},
  stopTimer: () => {}
})

interface MidnightTimerContextProviderProps {
  children: React.ReactNode
}

const MidnightTimerContextProvider: React.FC<MidnightTimerContextProviderProps> = ({
  children
}) => {
  const { getLegends } = useLegendsContext()
  const { addToast } = useToast()
  const midnightTimer = useUtcMidnightTimer()

  useEffect(() => {
    const updateLegendsAtMidnight = async () => {
      if (midnightTimer.hasMidnightOccurred) {
        await getLegends().catch(() => {
          addToast(
            "We couldn't retrieve your daily legends. Please reload the page or try again later.",
            { type: 'error' }
          )
        })
        midnightTimer.startTimer(true)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateLegendsAtMidnight()
  }, [midnightTimer.hasMidnightOccurred])

  const contextValue = useMemo(() => ({ ...midnightTimer }), [midnightTimer])

  return (
    <MidnightTimerContext.Provider value={contextValue}>{children}</MidnightTimerContext.Provider>
  )
}

export { MidnightTimerContextProvider, MidnightTimerContext }
