import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
import {
  CollectionResult as CollectionResultInterface,
  PortfolioController as PortfolioControllerState,
  TokenResult as TokenResultInterface
} from 'ambire-common/src/libs/portfolio/interfaces'
import { calculateAccountPortfolio } from 'ambire-common/src/libs/portfolio/portfolioView'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { feeTokens, gasTankFeeTokens } from '@common/constants/tokens'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

interface AccountPortfolio {
  tokens: TokenResultInterface[]
  collections: CollectionResultInterface[]
  totalAmount: number
  isAllReady: boolean
}
const PortfolioControllerStateContext = createContext<{
  accountPortfolio: AccountPortfolio | null
  state: PortfolioControllerState
  startedLoading: null | number
}>({
  accountPortfolio: {
    tokens: [],
    collections: [],
    totalAmount: 0,
    isAllReady: false
  },
  state: {} as any,
  startedLoading: null
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const { dispatch } = useBackgroundService()
  const mainCtrl = useMainControllerState()
  const [accountPortfolio, setAccountPortfolio] = useState<AccountPortfolio>({});
  const [state, setState] = useState({} as PortfolioControllerState)
  let startedLoading = null

  useEffect(() => {
    if (mainCtrl.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'portfolio' }
      })
    }
  }, [dispatch, mainCtrl.isReady, state])

  useEffect(() => {
     // Set an initial empty state for accountPortfolio
     setAccountPortfolio({
      tokens: [],
      collections: [],
      totalAmount: 0,
      isAllReady: false,
    });
  }, [mainCtrl.selectedAccount])

  useEffect(() => {
    if (!mainCtrl.selectedAccount) return

    const newAccountPortfolio = calculateAccountPortfolio(mainCtrl.selectedAccount, state, accountPortfolio, feeTokens, gasTankFeeTokens)
    
    if (newAccountPortfolio.isAllReady || !accountPortfolio?.tokens.length) {
      setAccountPortfolio(newAccountPortfolio)
    }
  }, [mainCtrl.selectedAccount, state])

  useEffect(() => {
    const onUpdate = (newState: PortfolioController) => {
      Object.values(newState?.latest[mainCtrl.selectedAccount]).forEach(network => {
        if (network?.result?.updateStarted && ( network?.result?.updateStarted < startedLoading || !startedLoading)) {
          startedLoading = network.result.updateStarted
        }
      })
      setState(newState)
    }

    eventBus.addEventListener('portfolio', onUpdate)

    return () => eventBus.removeEventListener('portfolio', onUpdate)
  }, [mainCtrl.selectedAccount])

 
  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state, 
          accountPortfolio,
          startedLoading
        }),
        [state, accountPortfolio]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
