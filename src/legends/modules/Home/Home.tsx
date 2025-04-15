import React from 'react'

import Page from '@legends/components/Page'
import useAccountContext from '@legends/hooks/useAccountContext'

import ActivitySection from './components/ActivitySection'
import CharacterSection from './components/CharacterSection'
import FaqSection from './components/FaqSection'
import LandingSection from './components/LandingSection'
import QuestsSection from './components/QuestsSection'

const Character = () => {
  const { nonV2Account, connectedAccount, allowNonV2Connection } = useAccountContext()

  return (
    <Page containerSize="full">
      {!allowNonV2Connection && !!nonV2Account ? (
        <LandingSection nonV2acc />
      ) : connectedAccount ? (
        <CharacterSection />
      ) : (
        <LandingSection />
      )}

      <QuestsSection />
      {connectedAccount && !nonV2Account && <ActivitySection />}

      {(!connectedAccount || !!nonV2Account) && <FaqSection />}
    </Page>
  )
}

export default Character
