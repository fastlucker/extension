import React from 'react'

import Adventure from '../../components/Adventure'
import Connect from '../../components/Connect'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import HowToPlay from '../../components/HowToPlay'
import MobileDisclaimerModal from '../../components/MobileDisclaimerModal'
import styles from './Landing.module.scss'

const Landing = () => {
  return (
    <div className={styles.wrapper}>
      <MobileDisclaimerModal />
      <Hero />
      <HowToPlay />
      <Adventure />
      <Connect />
      <Footer />
    </div>
  )
}

export default Landing
