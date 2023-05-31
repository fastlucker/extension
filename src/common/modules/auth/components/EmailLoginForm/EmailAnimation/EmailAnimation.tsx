import LottieView from 'lottie-react'
import React from 'react'

import EmailAnimation from './email-animation.json'

const Spinner = () => {
  return (
    <LottieView
      animationData={EmailAnimation}
      style={{ width: 139, height: 139, alignSelf: 'center' }}
      autoPlay
      loop
    />
  )
}

export default Spinner
