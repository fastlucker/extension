import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
import {
  CollectionResult as CollectionResultInterface,
  TokenResult as TokenResultInterface
} from 'ambire-common/src/libs/portfolio/interfaces'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import storage from '@web/extension-services/background/webapi/storage'
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
  accountPortfolio: AccountPortfolio
  state: PortfolioController
  gasTankAndRewardsData: {}
}>({
  accountPortfolio: {
    tokens: [],
    collections: [],
    totalAmount: 0,
    isAllReady: false
  },
  state: {} as any,
  gasTankAndRewardsData: {} as any
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const { dispatch } = useBackgroundService()
  const mainCtrl = useMainControllerState()
  const [accountPortfolio, setAccountPortfolio] = useState({})
  const [additionalPortfolio, setAdditionalPortftolio] = useState({})
  const [state, setState] = useState({} as PortfolioController)

  useEffect(() => {
    if (mainCtrl.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'portfolio' }
      })
    }
  }, [dispatch, mainCtrl.isReady, state])

  useEffect(() => {
    ;(async () => {
      // @TODO: We may want to store additionalPortfolio for acc as well
      const savedPortfolio = await storage.get('accountPortfolio')
      console.log(savedPortfolio, mainCtrl.selectedAccount)
      if (savedPortfolio[mainCtrl.selectedAccount]) {
        setAccountPortfolio(savedPortfolio[[mainCtrl.selectedAccount]])
      } else {
        setAccountPortfolio({})
      }

      const savedAdditionalPortfolio = await storage.get('additionalPortfolio', {})
      if (savedAdditionalPortfolio) {
        setAdditionalPortftolio(savedAdditionalPortfolio)
      } else {
        setAdditionalPortftolio({})
      }
    })()
  }, [mainCtrl.selectedAccount])

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
          gasTankAndRewardsData: additionalPortfolio,
          accountPortfolio
        }),
        [state, accountPortfolio, additionalPortfolio]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
