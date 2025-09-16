import LottieView from 'lottie-react'
import React, { useMemo } from 'react'

import SpinnerAnimation from './spinner-animation.json'
import WarningSpinnerAnimation from './spinner-warning-animation.json'
import WhiteSpinnerAnimation from './spinner-white-animation.json'

const Spinner = ({
  style,
  variant = 'gradient'
}: {
  style: any
  variant?: 'gradient' | 'white' | 'warning'
}) => {
  const animation = useMemo(() => {
    if (variant === 'white') return WhiteSpinnerAnimation
    if (variant === 'warning') return WarningSpinnerAnimation

    return SpinnerAnimation
  }, [variant])

  return (
    <LottieView
      animationData={animation}
      style={{ width: 40, height: 40, ...style }}
      autoPlay
      loop
    />
  )
}

export default React.memo(Spinner)
