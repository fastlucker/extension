import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { NetworkId } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import {
  CollectionResult as CollectionResultInterface,
  TokenResult as TokenResultInterface
} from '@ambire-common/libs/portfolio/interfaces'
import { calculateAccountPortfolio } from '@ambire-common/libs/portfolio/portfolioView'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

export interface AccountPortfolio {
  tokens: TokenResultInterface[]
  collections: CollectionResultInterface[]
  totalAmount: number
  isAllReady: boolean
}

const PortfolioControllerStateContext = createContext<{
  accountPortfolio: AccountPortfolio | null
  state: PortfolioController
  startedLoading: null | number
  refreshPortfolio: () => void
  getTemporaryTokens: (networkId: NetworkId, tokenId: CustomToken['address']) => void
  updateTokenPreferences: (token: CustomToken) => void
  removeTokenPreferences: (token: CustomToken) => void
  checkToken: ({ address, networkId }: { address: String; networkId: NetworkId }) => void
}>({
  accountPortfolio: {
    tokens: [],
    collections: [],
    totalAmount: 0,
    isAllReady: false
  },
  state: {} as any,
  startedLoading: null,
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
  const mainCtrl = useMainControllerState()
  const [accountPortfolio, setAccountPortfolio] = useState<AccountPortfolio>({
    tokens: [],
    collections: [],
    totalAmount: 0,
    isAllReady: false
  })
  const [startedLoading, setStartedLoading] = useState(null)
  const prevAccountPortfolio = useRef<AccountPortfolio>({
    tokens: [],
    collections: [],
    totalAmount: 0,
    isAllReady: false
  })

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
    setAccountPortfolio({
      tokens: [],
      collections: [],
      totalAmount: 0,
      isAllReady: false
    })
    prevAccountPortfolio.current = {
      tokens: [],
      collections: [],
      totalAmount: 0,
      isAllReady: false
    }
    setStartedLoading(null)
  }, [mainCtrl.selectedAccount])

  useEffect(() => {
    if (!mainCtrl.selectedAccount) return

    const newAccountPortfolio = calculateAccountPortfolio(
      mainCtrl.selectedAccount,
      state,
      prevAccountPortfolio?.current
    )

    if (newAccountPortfolio.isAllReady || !prevAccountPortfolio?.current?.tokens.length) {
      setAccountPortfolio(newAccountPortfolio)
      prevAccountPortfolio.current = newAccountPortfolio
    }
  }, [mainCtrl.selectedAccount, state])

  useEffect(() => {
    if (Object.keys(state?.latest || {}).length && mainCtrl?.selectedAccount) {
      Object.values(state?.latest[mainCtrl.selectedAccount as string] || {}).forEach(
        (network: any) => {
          if (
            network?.result?.updateStarted &&
            (!startedLoading || network?.result?.updateStarted < startedLoading)
          ) {
            setStartedLoading(network.result.updateStarted)
          }
        }
      )
    }
  }, [state?.latest, mainCtrl.selectedAccount, startedLoading])

  const updateAdditionalHints = useCallback(
    (tokenIds: string[]) => {
      dispatch({
        type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT',
        params: {
          forceUpdate: true,
          additionalHints: tokenIds
        }
      })
    },
    [dispatch]
  )

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
      type: 'MAIN_CONTROLLER_UPDATE_SELECTED_ACCOUNT',
      params: {
        forceUpdate: true
      }
    })
    setAccountPortfolio({ ...accountPortfolio, isAllReady: false } as any)
  }, [dispatch, accountPortfolio, setAccountPortfolio])

  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          accountPortfolio,
          refreshPortfolio,
          startedLoading,
          updateTokenPreferences,
          updateAdditionalHints,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens
        }),
        [
          state,
          accountPortfolio,
          startedLoading,
          refreshPortfolio,
          updateTokenPreferences,
          updateAdditionalHints,
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
