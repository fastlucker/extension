import './styles.css'

import LottieView, { LottieComponentProps } from 'lottie-react'
import React from 'react'

import animation from './animation.json'

const ConfettiAnimation = ({
  width,
  height,
  ...rest
}: { width: number; height: number } & Omit<LottieComponentProps, 'animationData'>) => {
  return (
    <LottieView
      {...rest}
      animationData={animation}
      style={{ width, height, position: 'absolute', pointerEvents: 'none', alignSelf: 'center' }}
      loop={false}
    />
  )
}

export default React.memo(ConfettiAnimation)
