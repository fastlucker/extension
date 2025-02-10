import React, { FC } from 'react'

import useMidnightTimerContext from '@legends/hooks/useMidnightTimerContext'

type Props = {
  type?: 'hours' | 'minutes'
  className?: string
}

const MidnightTimer: FC<Props> = ({ type = 'hours', className }) => {
  const midnightTimer = useMidnightTimerContext()

  const label = type === 'hours' ? midnightTimer.hoursLabel : midnightTimer.minutesLabel

  return <span className={className}>{label}</span>
}

export default MidnightTimer
