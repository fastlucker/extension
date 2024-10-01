import React from 'react'

import Page from '@legends/components/Page'

import ActivitySection from './components/ActivitySection'
import CharacterSection from './components/CharacterSection'
import RewardsSection from './components/RewardsSection'

const Character = () => {
  return (
    <Page>
      <CharacterSection />
      <RewardsSection />
      <ActivitySection />
    </Page>
  )
}

export default Character
