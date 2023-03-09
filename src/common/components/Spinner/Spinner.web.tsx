import LottieView from 'lottie-react'
import React from 'react'

import SpinnerAnimation from './spinner-animation.json'

const Spinner = () => {
  return (
    <LottieView animationData={SpinnerAnimation} style={{ width: 40, height: 40 }} autoPlay loop />
  )
}

export default Spinner
