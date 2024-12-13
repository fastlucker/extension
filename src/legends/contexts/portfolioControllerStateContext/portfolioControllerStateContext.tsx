import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useAccountContext from '@legends/hooks/useAccountContext'

export type AccountPortfolio = {
  amount?: number
  amountFormatted?: string
  isReady?: boolean
  error?: string
}

const PortfolioControllerStateContext = createContext<{
  accountPortfolio?: AccountPortfolio
  updateAccountPortfolio: (address: string) => void
}>({
  updateAccountPortfolio: () => {}
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const getPortfolioIntervalRef: any = useRef(null)
  const { connectedAccount, nonV2Account } = useAccountContext()
  const [accountPortfolio, setAccountPortfolio] = useState<AccountPortfolio>()

  const updateAccountPortfolio = useCallback(async (address: string): Promise<AccountPortfolio> => {
    if (!window.ambire) return { error: 'The Ambire extension is not installed!' }

    // Reset the portfolio to prevent displaying an outdated portfolio state for the previously connected account
    // while fetching the portfolio for the new account (address).
    setAccountPortfolio({ isReady: false })

    const portfolioRes = (await window.ambire.request({
      method: 'get_portfolioBalance',
      // TODO: impl a dynamic way of getting the chainIds
      params: [{ chainIds: ['0x1', '0x2105', '0xa', '0xa4b1', '0x82750'] }]
    })) as AccountPortfolio & { account: string }

    if (portfolioRes.account !== address) {
      setAccountPortfolio((portfolio) => {
        if (!portfolio?.isReady) {
          return {
            amount: 0,
            amountFormatted: '-',
            isReady: true
          }
        }

        return portfolio
      })

      return {
        isReady: true
      }
    }

    setAccountPortfolio(portfolioRes)
    return portfolioRes
  }, [])

  useEffect(() => {
    if (!connectedAccount) return

    // Ensure there isn't already a scheduled timeout before setting a new one.
    if (getPortfolioIntervalRef.current) clearTimeout(getPortfolioIntervalRef.current)

    // We don't want to trigger a portfolio update for non v2 account
    if (nonV2Account) return

    const runPortfolioContinuousUpdate = async () => {
      const portfolioRes = await updateAccountPortfolio(connectedAccount)

      getPortfolioIntervalRef.current = setTimeout(
        runPortfolioContinuousUpdate,
        // Polling mechanism for fetching the extension's portfolio.
        // A polling mechanism is needed because we fetch the portfolio from multiple networks,
        // and when calling `get_portfolioBalance`, the portfolio might not be fully fetched,
        // resulting in a partial amount being returned (`isReady=false`).
        // To handle this, we retry fetching the portfolio until `isReady=true`,
        // with a 3-second delay between calls.
        // Whenever the portfolio `isReady=true` we keep it up to date by refetching it every 30 seconds
        portfolioRes.isReady ? 30000 : 3000
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    runPortfolioContinuousUpdate()

    return () => {
      clearTimeout(getPortfolioIntervalRef.current)
    }
  }, [connectedAccount, nonV2Account, updateAccountPortfolio])

  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          accountPortfolio,
          updateAccountPortfolio
        }),
        [accountPortfolio, updateAccountPortfolio]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
