import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import wait from '@ambire-common/utils/wait'
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

// Polling mechanism for fetching the extension's portfolio.
// A polling mechanism is needed because we fetch the portfolio from multiple networks,
// and when calling `get_portfolioBalance`, the portfolio might not be fully fetched,
// resulting in a partial amount being returned (`isReady=false`).
// To handle this, we retry fetching the portfolio until `isReady=true`,
// with a 3-second delay between calls, or until `maxRetries` is reached.
const getPortfolio = async (
  address: string,
  retries = 0,
  maxRetries = 10
): Promise<AccountPortfolio> => {
  if (!window.ambire) {
    return {
      error: 'The Ambire extension is not installed!'
    }
  }

  const portfolio = (await window.ambire.request({
    method: 'get_portfolioBalance',
    params: []
  })) as AccountPortfolio

  // If portfolio is not ready and retries have not exceeded maxRetries
  if (!portfolio.isReady) {
    if (retries < maxRetries) {
      await wait(3000) // wait for 3 second
      return getPortfolio(address, retries + 1, maxRetries) // increment retry count
    }

    return {
      ...portfolio,
      error: 'Unable to retrieve your portfolio. Please try again later.'
    }
  }

  return portfolio
}

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const [accountPortfolio, setAccountPortfolio] = useState<AccountPortfolio>()

  const updateAccountPortfolio = useCallback(async (address: string) => {
    const portfolio = await getPortfolio(address)

    setAccountPortfolio(portfolio)
  }, [])

  useEffect(() => {
    if (!connectedAccount) return

    updateAccountPortfolio(connectedAccount).catch(() =>
      setAccountPortfolio({ error: 'Unable to retrieve your portfolio. Please try again later.' })
    )
  }, [connectedAccount, updateAccountPortfolio])

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
