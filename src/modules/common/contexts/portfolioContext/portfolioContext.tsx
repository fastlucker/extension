import usePortfolio, { UsePortfolioReturnTypes } from 'ambire-common/src/hooks/usePortfolio'
// TODO: fix ignored linter warnings
import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppState } from 'react-native'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'
import useToast from '@modules/common/hooks/useToast'
import { fetchGet } from '@modules/common/services/fetch'

const PortfolioContext = createContext<UsePortfolioReturnTypes>({
  balance: {
    total: {
      full: 0,
      truncated: 0,
      decimals: '00'
    },
    tokens: []
  },
  otherBalances: [],
  tokens: [],
  protocols: [],
  extraTokens: [],
  hiddenTokens: [],
  collectibles: [],
  requestOtherProtocolsRefresh: () => Promise.resolve(null),
  onAddExtraToken: () => {},
  onRemoveExtraToken: () => {},
  onAddHiddenToken: () => {},
  onRemoveHiddenToken: () => {},
  balancesByNetworksLoading: {},
  isCurrNetworkBalanceLoading: false,
  areAllNetworksBalancesLoading: () => false,
  otherProtocolsByNetworksLoading: {},
  isCurrNetworkProtocolsLoading: false,
  loadBalance: () => {},
  loadProtocols: () => {}
})

const getBalances = (network: any, protocol: any, address: any, provider?: any) =>
  fetchGet(
    `${
      provider === 'velcro' ? CONFIG.VELCRO_API_ENDPOINT : CONFIG.ZAPPER_API_ENDPOINT
    }/protocols/${protocol}/balances?addresses[]=${address}&network=${network}&api_key=${
      CONFIG.ZAPPER_API_KEY
    }&newBalances=true`
  )

const PortfolioProvider: React.FC = ({ children }) => {
  const appState = useRef(AppState.currentState)

  const [appStateVisible, setAppStateVisible] = useState<any>(appState.current)

  const { addToast } = useToast()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()

  // Refresh balance when app is focused
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    }

    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const {
    balance,
    otherBalances,
    tokens,
    extraTokens,
    hiddenTokens,
    protocols,
    collectibles,
    requestOtherProtocolsRefresh,
    onAddExtraToken,
    onRemoveExtraToken,
    onAddHiddenToken,
    onRemoveHiddenToken,
    balancesByNetworksLoading,
    isCurrNetworkBalanceLoading,
    areAllNetworksBalancesLoading,
    otherProtocolsByNetworksLoading,
    isCurrNetworkProtocolsLoading,
    loadBalance,
    loadProtocols
  } = usePortfolio({
    currentNetwork: network?.id,
    account: selectedAcc,
    useStorage,
    isVisible: appStateVisible === 'active',
    onMessage: addToast,
    getBalances
  })

  return (
    <PortfolioContext.Provider
      value={useMemo(
        () => ({
          balance,
          otherBalances,
          tokens,
          extraTokens,
          hiddenTokens,
          protocols,
          collectibles,
          requestOtherProtocolsRefresh,
          onAddExtraToken,
          onRemoveExtraToken,
          onAddHiddenToken,
          onRemoveHiddenToken,
          balancesByNetworksLoading,
          isCurrNetworkBalanceLoading,
          areAllNetworksBalancesLoading,
          otherProtocolsByNetworksLoading,
          isCurrNetworkProtocolsLoading,
          loadBalance,
          loadProtocols
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
          balance,
          otherBalances,
          tokens,
          extraTokens,
          hiddenTokens,
          protocols,
          collectibles,
          requestOtherProtocolsRefresh,
          onAddExtraToken,
          onRemoveExtraToken,
          onAddHiddenToken,
          onRemoveHiddenToken,
          balancesByNetworksLoading,
          isCurrNetworkBalanceLoading,
          areAllNetworksBalancesLoading,
          otherProtocolsByNetworksLoading,
          isCurrNetworkProtocolsLoading
        ]
      )}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export { PortfolioContext, PortfolioProvider }
