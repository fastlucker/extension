import LottieView from 'lottie-react'
import React from 'react'

import animation from './animated-arrows.json'

const AnimatedArrows = () => {
  return (
    <LottieView
      animationData={animation}
      style={{
        width: 45,
        height: 45,
        transform: 'rotate(-90deg)'
      }}
      autoPlay
      loop
    />
  )
}

export default AnimatedArrows
