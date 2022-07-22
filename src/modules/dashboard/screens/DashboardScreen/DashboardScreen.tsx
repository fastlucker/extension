import React from 'react'
import { RefreshControl } from 'react-native'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import colors from '@modules/common/styles/colors'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'
import { AssetsToggleProvider } from '@modules/dashboard/contexts/assetsToggleContext'

const DashboardScreen = () => {
  const {
    loadBalance,
    loadProtocols,
    isCurrNetworkBalanceLoading,
    isCurrNetworkProtocolsLoading,
    balance,
    otherBalances,
    protocols,
    tokens,
    collectibles,
    extraTokens,
    hiddenTokens,
    onAddExtraToken,
    onAddHiddenToken,
    onRemoveExtraToken,
    onRemoveHiddenToken,
    setDataLoaded,
    dataLoaded
  } = usePortfolio()
  const { network, setNetwork } = useNetwork()
  const { selectedAcc } = useAccounts()

  const handleRefresh = () => {
    setDataLoaded(false)
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
          isLoading={isCurrNetworkBalanceLoading && !dataLoaded}
          networkId={network?.id}
          setNetwork={setNetwork}
          account={selectedAcc}
        />
        <AssetsToggleProvider>
          <Assets
            tokens={tokens}
            collectibles={collectibles}
            extraTokens={extraTokens}
            hiddenTokens={hiddenTokens}
            protocols={protocols}
            isLoading={
              (isCurrNetworkBalanceLoading || isCurrNetworkProtocolsLoading) && !dataLoaded
            }
            explorerUrl={network?.explorerUrl}
            networkId={network?.id}
            networkRpc={network?.rpc}
            networkName={network?.name}
            selectedAcc={selectedAcc}
            onAddExtraToken={onAddExtraToken}
            onAddHiddenToken={onAddHiddenToken}
            onRemoveExtraToken={onRemoveExtraToken}
            onRemoveHiddenToken={onRemoveHiddenToken}
          />
        </AssetsToggleProvider>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DashboardScreen
