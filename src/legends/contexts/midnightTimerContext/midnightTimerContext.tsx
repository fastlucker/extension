import React, { createContext, useEffect, useMemo } from 'react'

import useLegendsContext from '@legends/hooks/useLegendsContext'
import useUtcMidnightTimer, {
  MidnightTimerType
} from '@legends/hooks/useUtcMidnightTimer/useUtcMidnightTimer'

const MidnightTimerContext = createContext<MidnightTimerType>({
  hoursLabel: '',
  minutesLabel: '',
  hasMidnightOccurred: false,
  startTimer: () => {},
  stopTimer: () => {}
})

const MidnightTimerContextProvider: React.FC<any> = ({ children }) => {
  const { getLegends } = useLegendsContext()
  const midnightTimer = useUtcMidnightTimer()

  useEffect(() => {
    const updateLegendsAtMidnight = async () => {
      if (midnightTimer.hasMidnightOccurred) {
        await getLegends()
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
