import React from 'react'

import Adventure from '@legends/modules/landing/components/Adventure'
import Connect from '@legends/modules/landing/components/Connect'
import Footer from '@legends/modules/landing/components/Footer'
import Hero from '@legends/modules/landing/components/Hero'
import HowToPlay from '@legends/modules/landing/components/HowToPlay'
import MobileDisclaimerModal from '@legends/modules/landing/components/MobileDisclaimerModal'

const Landing = () => {
  return (
    <div>
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
