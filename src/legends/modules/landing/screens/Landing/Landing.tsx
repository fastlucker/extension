import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import Adventure from '@legends/modules/landing/components/Adventure'
import Connect from '@legends/modules/landing/components/Connect'
import Footer from '@legends/modules/landing/components/Footer'
import Hero from '@legends/modules/landing/components/Hero'
import HowToPlay from '@legends/modules/landing/components/HowToPlay'
import MobileDisclaimerModal from '@legends/modules/landing/components/MobileDisclaimerModal'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

const Landing = () => {
  const navigate = useNavigate()
  const { connectedAccount, nonV2Account } = useAccountContext()

  useEffect(() => {
    if (connectedAccount) {
      navigate(LEGENDS_ROUTES.character)
    } else if (nonV2Account) {
      navigate(LEGENDS_ROUTES.characterSelect)
    }
  }, [connectedAccount, navigate, nonV2Account])

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
