import LottieView from 'lottie-react-native'
import React from 'react'

import SpinnerAnimation from './spinner-animation.json'
import styles from './styles'

const Spinner = () => {
  return <LottieView source={SpinnerAnimation} style={styles.spinner} autoPlay loop />
}

export default Spinner
