import LottieView from 'lottie-react'
import React from 'react'

import animation from './email-animation.json'

const EmailAnimation = () => {
  return (
    <LottieView
      animationData={animation}
      style={{ width: 139, height: 139, alignSelf: 'center' }}
      autoPlay
      loop
    />
  )
}

export default EmailAnimation
