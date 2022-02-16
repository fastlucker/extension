import React from 'react'

import Wrapper from '@modules/common/components/Wrapper'
import Accounts from '@modules/dashboard/components/Accounts'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'
import BalancesChart from '@modules/dashboard/components/BalancesChart'

const DashboardScreen = () => {
  return (
    <Wrapper>
      <Accounts />

      <Balances />

      <BalancesChart />

      <Assets />
    </Wrapper>
  )
}

export default DashboardScreen
