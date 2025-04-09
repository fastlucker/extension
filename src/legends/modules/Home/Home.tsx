import React from 'react'

import Page from '@legends/components/Page'

import ActivitySection from './components/ActivitySection'
import CharacterSection from './components/CharacterSection'
import QuestsSection from './components/QuestsSection'

const Character = () => {
  return (
    <Page containerSize="full">
      <CharacterSection />
      <QuestsSection />
      <ActivitySection />
    </Page>
  )
}

export default Character
