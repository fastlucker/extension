import React from 'react'
import { View } from 'react-native'

import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import Text from '@common/components/Text'

const SIDEBAR_STEPS = [
  {
    text: 'Prepare a pen and a piece of paper',
    icon: SeedPhraseRecoveryIcon
  },
  {
    text: 'Write down and secure the Seed Phrase',
    icon: SeedPhraseRecoveryIcon
  },
  {
    text: 'Confirm your Seed Phrase',
    icon: SeedPhraseRecoveryIcon
  }
]

const CreateSeedPhraseSidebar = () => {
  return (
    <View>
      {SIDEBAR_STEPS.map((step, index) => (
        <Text key={step.text}>
          {index} {step.text}
        </Text>
      ))}
    </View>
  )
}

export default CreateSeedPhraseSidebar
