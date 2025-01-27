import { useContext } from 'react'

import { MidnightTimerContext } from '@legends/contexts/midnightTimerContext'

export default function useMidnightTimerContext() {
  const context = useContext(MidnightTimerContext)

  if (!context) {
    throw new Error('useMidnightTimerContext must be used within a MidnightTimerContext')
  }

  return context
}
