import React, { useEffect } from 'react'

import Connect from '../../components/Connect'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import MobileDisclaimerModal from '../../components/MobileDisclaimerModal'
import styles from './Welcome.module.scss'

const Welcome = () => {
  useEffect(() => {
    if (window.ambire) return

    const onFocus = () => {
      if (window.ambire) return
      // console.log('focused', window.ambire)
      // if (window.ambire) {
      window.location.reload()
      // }
    }

    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <MobileDisclaimerModal />
      <Hero />
      <Connect />
      <Footer />
    </div>
  )
}

export default Welcome
