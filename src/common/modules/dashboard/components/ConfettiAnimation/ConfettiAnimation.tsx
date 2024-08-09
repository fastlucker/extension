import './styles.css'

import LottieView from 'lottie-react'
import React from 'react'

import animation from './animation.json'

const ConfettiAnimation = ({ width, height }: { width: number; height: number }) => {
  return (
    <LottieView
      animationData={animation}
      style={{ width, height, position: 'absolute', pointerEvents: 'none', alignSelf: 'center' }}
      autoPlay
    />
  )
}

export default React.memo(ConfettiAnimation)
