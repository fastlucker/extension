import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'

const GasTankScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <Text>Gas Tank</Text>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default GasTankScreen
