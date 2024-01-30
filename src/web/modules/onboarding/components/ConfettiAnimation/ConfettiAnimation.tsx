import './styles.css'

import LottieView from 'lottie-react'

import animation from './animation.json'

const ConfettiLogo = () => {
  return <LottieView animationData={animation} style={{ width: 600, height: 500 }} autoPlay loop />
}

export default ConfettiLogo
