import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
import {
  CollectionResult as CollectionResultInterface,
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
  state: PortfolioController
}>({
  accountPortfolio: {
    tokens: [],
    collections: [],
    totalAmount: 0,
    isAllReady: false
  },
  state: {} as any,
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const { dispatch } = useBackgroundService()
  const mainCtrl = useMainControllerState()
  const [accountPortfolios, setAccountPortfolios] = useState<{ [key: string]: AccountPortfolio }>({});
  const [state, setState] = useState({} as PortfolioController)
  
  const currentAccountPortfolio = useMemo(() => mainCtrl.selectedAccount ? accountPortfolios[mainCtrl.selectedAccount] : null, [accountPortfolios, mainCtrl.selectedAccount])
  
  useEffect(() => {
    if (mainCtrl.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'portfolio' }
      })
    }
  }, [dispatch, mainCtrl.isReady, state])

  useEffect(() => {
    if (!mainCtrl.selectedAccount) return

    const newAccountPortfolio = calculateAccountPortfolio(mainCtrl.selectedAccount, state, currentAccountPortfolio, feeTokens, gasTankFeeTokens)

    if (newAccountPortfolio.isAllReady || !currentAccountPortfolio?.tokens.length) {
      setAccountPortfolios((prevAccountPortfolios) => ({
        ...prevAccountPortfolios,
        ...(mainCtrl.selectedAccount ? { [mainCtrl.selectedAccount]: newAccountPortfolio } : {})
      }));
  
    }
  }, [mainCtrl.selectedAccount, state])

  useEffect(() => {
    const onUpdate = (newState: PortfolioController) => {
      setState(newState)
    }

    eventBus.addEventListener('portfolio', onUpdate)

    return () => eventBus.removeEventListener('portfolio', onUpdate)
  }, [])

 
  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state, 
          accountPortfolio: currentAccountPortfolio 
        }),
        [state, currentAccountPortfolio]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
