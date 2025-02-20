import React, { FC } from 'react'

import useMidnightTimerContext from '@legends/hooks/useMidnightTimerContext'

type Props = {
  type?: 'hours' | 'minutes' | 'hoursAndMinutes'
  className?: string
}

const MidnightTimer: FC<Props> = ({ type = 'hours', className }) => {
  const midnightTimer = useMidnightTimerContext()

  let label = ''
  if (type === 'hours') {
    label = midnightTimer.hoursLabel
  } else if (type === 'minutes') {
    label = midnightTimer.minutesLabel
  } else if (type === 'hoursAndMinutes') {
    label = midnightTimer.hoursAndMinutesLabel
  }
  
  return <span className={className}>{label}</span>
}

export default MidnightTimer
