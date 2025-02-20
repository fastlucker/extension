import React, { FC } from 'react'

import useMidnightTimerContext from '@legends/hooks/useMidnightTimerContext'

type Props = {
  type: 'hours' | 'minutes' | 'hoursAndMinutes'
  className?: string
}

const MidnightTimer: FC<Props> = ({ type = 'hours', className }) => {
  const midnightTimer = useMidnightTimerContext()

  const label = type ? midnightTimer[`${type}Label`] :  midnightTimer[`hoursLabel`]
  
  return <span className={className}>{label}</span>
}

export default MidnightTimer
