import React from 'react'
import { RefreshControl } from 'react-native'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { colorPalette as colors } from '@modules/common/styles/colors'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'

const DashboardScreen = () => {
  const {
    loadBalance,
    loadProtocols,
    isCurrNetworkBalanceLoading,
    isCurrNetworkProtocolsLoading,
    balance,
    otherBalances,
    protocols,
    tokens
  } = usePortfolio()

  const { network, setNetwork } = useNetwork()
  const { selectedAcc } = useAccounts()

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
            enabled={!isCurrNetworkBalanceLoading && !isCurrNetworkProtocolsLoading}
          />
        }
      >
        <Balances
          balanceTruncated={balance.total?.truncated}
          balanceDecimals={balance.total?.decimals}
          otherBalances={otherBalances}
          isLoading={isCurrNetworkBalanceLoading}
          networkId={network?.id}
          setNetwork={setNetwork}
        />
        <Assets
          tokens={tokens}
          protocols={protocols}
          isLoading={isCurrNetworkBalanceLoading || isCurrNetworkProtocolsLoading}
          explorerUrl={network?.explorerUrl}
          networkId={network?.id}
          selectedAcc={selectedAcc}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DashboardScreen
