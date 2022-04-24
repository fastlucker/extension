import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'

const DashboardScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav>
        <Balances />
        <Assets />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DashboardScreen
