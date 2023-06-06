import LottieView from 'lottie-react'
import React from 'react'

import SpinnerAnimation from './spinner-animation-web.json'

const Spinner = ({ width = 40, height = 40 }: { width: number; height: number }) => {
  return <LottieView animationData={SpinnerAnimation} style={{ width, height }} autoPlay loop />
}

export default Spinner
