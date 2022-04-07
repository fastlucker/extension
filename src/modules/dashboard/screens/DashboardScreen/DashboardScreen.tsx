import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'
import BalancesChart from '@modules/dashboard/components/BalancesChart'

const DashboardScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav>
        <Balances />

        <BalancesChart />

        <Assets />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DashboardScreen
