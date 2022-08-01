import usePortfolio, { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio'
import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppState } from 'react-native'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'
import useToasts from '@modules/common/hooks/useToast'
import { fetchGet } from '@modules/common/services/fetch'

interface PortfolioContextReturnType extends UsePortfolioReturnType {
  dataLoaded: boolean
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const PortfolioContext = createContext<PortfolioContextReturnType>({
  balance: {
    total: {
      full: 0,
      truncated: '0',
      decimals: '00'
    },
    network: ''
  },
  otherBalances: [],
  tokens: [],
  protocols: [] as any,
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
  loadProtocols: () => {},
  dataLoaded: false,
  setDataLoaded: () => {}
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
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  const [appStateVisible, setAppStateVisible] = useState<any>(appState.current)

  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()

  // Refresh balance when app is focused
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    }

    const stateChange = AppState.addEventListener('change', handleAppStateChange)
    return () => stateChange.remove()
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
    currentNetwork: network?.id as string,
    account: selectedAcc,
    useStorage,
    isVisible: appStateVisible === 'active',
    useToasts,
    getBalances
  })

  const prevIsCurrNetworkBalanceLoading = usePrevious(isCurrNetworkBalanceLoading)
  const prevIsCurrNetworkProtocolsLoading = usePrevious(isCurrNetworkProtocolsLoading)

  useEffect(() => {
    if (
      (prevIsCurrNetworkBalanceLoading && !isCurrNetworkBalanceLoading) ||
      (prevIsCurrNetworkProtocolsLoading && !isCurrNetworkProtocolsLoading)
    ) {
      setDataLoaded(true)
    }
  }, [isCurrNetworkBalanceLoading, isCurrNetworkProtocolsLoading])

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
          loadProtocols,
          dataLoaded,
          setDataLoaded
        }),
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
          isCurrNetworkProtocolsLoading,
          loadBalance,
          loadProtocols,
          dataLoaded,
          setDataLoaded
        ]
      )}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export { PortfolioContext, PortfolioProvider }
