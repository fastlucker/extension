import React from 'react'
import { RefreshControl } from 'react-native'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { colorPalette as colors } from '@modules/common/styles/colors'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'

const DashboardScreen = () => {
  const { loadBalance, loadProtocols, isBalanceLoading, areProtocolsLoading } = usePortfolio()

  const handleRefresh = () => {
    loadBalance()
    loadProtocols()
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        hasBottomTabNav
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={colors.titan}
            progressBackgroundColor={colors.titan}
            enabled={!isBalanceLoading && !areProtocolsLoading}
          />
        }
      >
        <Balances />
        <Assets />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DashboardScreen
