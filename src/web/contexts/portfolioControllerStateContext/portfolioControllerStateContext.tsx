import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { NetworkId } from '@ambire-common/interfaces/network'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import {
  CollectionResult as CollectionResultInterface,
  TokenResult as TokenResultInterface
} from '@ambire-common/libs/portfolio/interfaces'
import { calculateAccountPortfolio } from '@ambire-common/libs/portfolio/portfolioView'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

export interface AccountPortfolio {
  tokens: TokenResultInterface[]
  collections: CollectionResultInterface[]
  totalAmount: number
  isAllReady: boolean
}

const DEFAULT_ACCOUNT_PORTFOLIO = {
  tokens: [],
  collections: [],
  totalAmount: 0,
  isAllReady: false
}

const PortfolioControllerStateContext = createContext<{
  accountPortfolio: AccountPortfolio | null
  state: PortfolioController
  startedLoadingAtTimestamp: null | number
  refreshPortfolio: () => void
  getTemporaryTokens: (networkId: NetworkId, tokenId: CustomToken['address']) => void
  updateTokenPreferences: (token: CustomToken) => void
  removeTokenPreferences: (token: CustomToken) => void
  checkToken: ({ address, networkId }: { address: String; networkId: NetworkId }) => void
}>({
  accountPortfolio: DEFAULT_ACCOUNT_PORTFOLIO,
  state: {} as any,
  startedLoadingAtTimestamp: null,
  refreshPortfolio: () => {},
  getTemporaryTokens: () => {},
  updateTokenPreferences: () => {},
  removeTokenPreferences: () => {},
  checkToken: () => {}
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'portfolio'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const accountsState = useAccountsControllerState()
  const account = accountsState.accounts?.find((acc) => acc.addr === accountsState.selectedAccount)

  const [accountPortfolio, setAccountPortfolio] =
    useState<AccountPortfolio>(DEFAULT_ACCOUNT_PORTFOLIO)
  const [startedLoadingAtTimestamp, setStartedLoadingAtTimestamp] = useState<number | null>(null)
  const prevAccountPortfolio = useRef<AccountPortfolio>(DEFAULT_ACCOUNT_PORTFOLIO)

  const resetAccountPortfolio = useCallback(() => {
    setAccountPortfolio(DEFAULT_ACCOUNT_PORTFOLIO)
    prevAccountPortfolio.current = DEFAULT_ACCOUNT_PORTFOLIO
    setStartedLoadingAtTimestamp(null)
  }, [])

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, state])

  useEffect(() => {
    // Set an initial empty state for accountPortfolio
    resetAccountPortfolio()
  }, [accountsState.selectedAccount, resetAccountPortfolio])

  useEffect(() => {
    if (!accountsState.selectedAccount || !account) return

    const newAccountPortfolio = calculateAccountPortfolio(
      accountsState.selectedAccount,
      state,
      prevAccountPortfolio?.current,
      account
    )

    if (newAccountPortfolio.isAllReady || !prevAccountPortfolio?.current?.tokens.length) {
      setAccountPortfolio(newAccountPortfolio)
      prevAccountPortfolio.current = newAccountPortfolio
    }
  }, [accountsState.selectedAccount, account, state])

  useEffect(() => {
    if (startedLoadingAtTimestamp && accountPortfolio.isAllReady) {
      setStartedLoadingAtTimestamp(null)
      return
    }

    if (!startedLoadingAtTimestamp && !accountPortfolio.isAllReady) {
      setStartedLoadingAtTimestamp(Date.now())
    }
  }, [startedLoadingAtTimestamp, accountPortfolio.isAllReady])

  const getTemporaryTokens = useCallback(
    (networkId: NetworkId, tokenId: string) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_GET_TEMPORARY_TOKENS',
        params: {
          networkId,
          additionalHint: tokenId
        }
      })
    },
    [dispatch]
  )

  const updateTokenPreferences = useCallback(
    async (token: CustomToken) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES',
        params: {
          token
        }
      })
    },
    [dispatch]
  )

  const removeTokenPreferences = useCallback(
    (token: CustomToken) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_REMOVE_TOKEN_PREFERENCES',
        params: {
          token
        }
      })
    },
    [dispatch]
  )

  const checkToken = useCallback(
    (token: { networkId: NetworkId; address: string }) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_CHECK_TOKEN',
        params: {
          token
        }
      })
    },
    [dispatch]
  )

  const refreshPortfolio = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT_PORTFOLIO',
      params: { forceUpdate: true }
    })
    resetAccountPortfolio()
  }, [dispatch, resetAccountPortfolio])

  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          accountPortfolio,
          refreshPortfolio,
          startedLoadingAtTimestamp,
          updateTokenPreferences,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens
        }),
        [
          state,
          accountPortfolio,
          startedLoadingAtTimestamp,
          refreshPortfolio,
          updateTokenPreferences,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens
        ]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
