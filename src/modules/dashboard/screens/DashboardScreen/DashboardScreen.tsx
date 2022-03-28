import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import Accounts from '@modules/dashboard/components/Accounts'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'
import BalancesChart from '@modules/dashboard/components/BalancesChart'

const DashboardScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Accounts />

        <Balances />

        <BalancesChart />

        <Assets />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DashboardScreen
