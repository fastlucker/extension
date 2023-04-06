import LottieView from 'lottie-react-native'
import React from 'react'

import animation from './animated-arrows.json'
import styles from './styles'

const AnimatedArrows = () => {
  return <LottieView source={animation} style={styles.lottie} autoPlay loop />
}

export default AnimatedArrows
