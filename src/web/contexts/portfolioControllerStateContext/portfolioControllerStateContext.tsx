import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
import { formatUnits } from 'ethers'
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
  const [isGasTankAndRewardsStateLoading, setIsGasTankAndRewardsStateLoading] = useState(true)
  const [gasTankAndRewardsState, setGasTankAndRewardsState] = useState({})
  const [accountPortfolio, setAccountPortfolio] = useState({
    tokens: [],
    totalAmount: 0,
    isAllReady: true
  })
  const gasTankBalance = useMemo(
    () =>
      !isGasTankAndRewardsStateLoading &&
      gasTankAndRewardsState &&
      gasTankAndRewardsState?.gasTank?.balance.reduce((total, token) => {
        const priceInUSD = token.priceIn.find(({ baseCurrency }) => baseCurrency === 'usd')
        if (priceInUSD) {
          return total + formatUnits(BigInt(token.amount), token.decimals) * priceInUSD.price
        }
        return total
      }, 0),
    [isGasTankAndRewardsStateLoading, gasTankAndRewardsState]
  )

  // Calculate Rewards Balance Sum
  const rewardsBalance = useMemo(
    () =>
      !isGasTankAndRewardsStateLoading &&
      gasTankAndRewardsState &&
      gasTankAndRewardsState?.rewards &&
      gasTankAndRewardsState?.rewards?.walletClaimableBalance
        ? formatUnits(
            BigInt(gasTankAndRewardsState?.rewards?.walletClaimableBalance?.amount),
            gasTankAndRewardsState?.rewards?.walletClaimableBalance?.decimals
          ) *
            gasTankAndRewardsState?.rewards?.walletClaimableBalance?.priceIn?.find(
              ({ baseCurrency }) => baseCurrency === 'usd'
            ).price || 0
        : 0 + gasTankAndRewardsState?.rewards?.xWalletClaimableBalance
        ? formatUnits(
            BigInt(gasTankAndRewardsState?.rewards?.xWalletClaimableBalance.amount),
            gasTankAndRewardsState?.rewards?.xWalletClaimableBalance.decimals
          ) *
            gasTankAndRewardsState?.rewards?.xWalletClaimableBalance.priceIn.find(
              ({ baseCurrency }) => baseCurrency === 'usd'
            ).price || 0
        : 0,
    [isGasTankAndRewardsStateLoading, gasTankAndRewardsState]
  )
  console.log(rewardsBalance)

  useEffect(() => {
    // Function to calculate account portfolio summary
    const calculateAccountPortfolio = () => {
      // Calculate Gas Tank Balance Sum
      const updatedTokens: any = []
      const updatedTotalAmount = accountPortfolio.totalAmount
      let newTotalAmount = gasTankBalance + rewardsBalance
      let allReady = true

      if (!mainCtrl.selectedAccount || !state.latest || !state.latest[mainCtrl.selectedAccount]) {
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

        if (networkData.isReady && !networkData.isLoading && networkData.result) {
          // console.log(networkData)
          const networkTotal = networkData.result.total?.usd || 0 // Use the existing network total
          newTotalAmount += networkTotal

          // Assuming you want to push tokens to updatedTokens array as well
          const networkTokens = networkData.result.tokens
          updatedTokens.push(...networkTokens)
          if (networkTokens.length) {
            setAccountPortfolio((prev) => ({
              ...prev,
              tokens: updatedTokens
            }))
          }
        } else if (
          networkData.isReady &&
          networkData.isLoading &&
          !accountPortfolio.tokens.length
        ) {
          // Handle the case where network is ready but still loading
          allReady = false
        }
      })

      setAccountPortfolio((prev) => ({
        ...prev,
        totalAmount: newTotalAmount,
        isAllReady: allReady && !isGasTankAndRewardsStateLoading
      }))
    }

    // Calculate account portfolio summary
    calculateAccountPortfolio()
  }, [mainCtrl.selectedAccount, state, gasTankAndRewardsState, isGasTankAndRewardsStateLoading])

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
    if (!mainCtrl.selectedAccount) return
    // Fetch data on page load
    fetchGasTankAndRewardsData()

    // Set up interval to refetch data every minute
    const interval = setInterval(fetchGasTankAndRewardsData, 60000) // 60000 milliseconds = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(interval)
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
