import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useRelayerData from '@common/hooks/useRelayerData'
import eventBus from '@web/extension-services/event/eventBus'
import useMainControllerState from '@web/hooks/useMainControllerState'

const PortfolioControllerStateContext = createContext<PortfolioController>({
  accountPortfolio: {
    tokens: [],
    totalAmount: 0,
    isAllReady: false
  },
  state: PortfolioController,
  gasTankAndRewardsState: {}
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const mainCtrl = useMainControllerState()
  const [state, setState] = useState({} as PortfolioController)
  const [isGasTankAndRewardsStateLoading, setIsGasTankAndRewardsStateLoading] = useState({})
  const [gasTankAndRewardsState, setGasTankAndRewardsState] = useState({})
  const [accountPortfolio, setAccountPortfolio] = useState({})

  useEffect(() => {
    // Function to calculate network summary
    const calculateNetworkSummary = () => {
      const updatedTokens = []
      let updatedTotalAmount = 0
      let allReady = true

      if (!mainCtrl.selectedAccount || !state.latest || !state.latest[mainCtrl.selectedAccount]) {
        console.log(state)
        setAccountPortfolio({
          tokens: updatedTokens,
          totalAmount: updatedTotalAmount,
          isAllReady: allReady
        })
        return
      }

      const selectedAccountData = state.latest[mainCtrl.selectedAccount]

      // Convert the object keys to an array and iterate using forEach
      Object.keys(selectedAccountData).forEach((network) => {
        const networkData = selectedAccountData[network]

        if (networkData.isReady && !networkData.isLoading) {
          // console.log(networkData)
          const networkTotal = networkData.result.total?.usd || 0 // Use the existing network total
          updatedTotalAmount += networkTotal

          // Assuming you want to push tokens to updatedTokens array as well
          const networkTokens = networkData.result.tokens
          updatedTokens.push(...networkTokens)

          if (networkTokens.length) {
            setAccountPortfolio((prev) => ({
              ...prev,
              tokens: updatedTokens
            }))
          }
        } else if (networkData.isReady && networkData.isLoading) {
          // Handle the case where network is ready but still loading
          allReady = false
        }
      })

      setAccountPortfolio({
        tokens: updatedTokens,
        // TODO: Calculate gas balance as well
        totalAmount: updatedTotalAmount,
        isAllReady: allReady
      })
    }

    // Calculate network summary
    calculateNetworkSummary()
  }, [mainCtrl.selectedAccount, state])
  useEffect(() => {
    const onUpdate = (newState: PortfolioController) => {
      setState(newState)
    }

    eventBus.addEventListener('portfolio', onUpdate)

    return () => eventBus.removeEventListener('portfolio', onUpdate)
  }, [])

  const fetchGasTankAndRewardsData = useCallback(async () => {
    setIsGasTankAndRewardsStateLoading(true)
    const res = await useRelayerData(`/v2/identity/${mainCtrl.selectedAccount}/info`)
    // TODO: Handle error
    if (res.data) {
      setIsGasTankAndRewardsStateLoading(false)
      setGasTankAndRewardsState(res.data)
    }
  }, [mainCtrl.selectedAccount])

  useEffect(() => {
    mainCtrl.selectedAccount && fetchGasTankAndRewardsData()
  }, [fetchGasTankAndRewardsData, mainCtrl.selectedAccount])

  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          gasTankAndRewardsState,
          accountPortfolio
        }),
        [state, gasTankAndRewardsState, accountPortfolio]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
