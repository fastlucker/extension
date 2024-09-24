import React, { createContext, useCallback, useMemo, useState } from 'react'
import { getIdentity } from '@ambire-common/libs/accountAdder/accountAdder'
import wait from '@ambire-common/utils/wait'

const RELAYER_URL = 'https://staging-relayer.ambire.com'

type PortfolioResponse = {
  amount?: number
  amountFormatted?: string
  isReady?: boolean
  error?: string
}

export type AccountPortfolio = {
  address: string
} & PortfolioResponse

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
): Promise<PortfolioResponse> => {
  if (!window.ambire) {
    return {
      error: 'The Ambire extension is not installed!'
    }
  }

  const portfolio = (await window.ambire.request({
    method: 'get_portfolioBalance',
    params: []
  })) as PortfolioResponse

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
  const [accountPortfolio, setAccountPortfolio] = useState<AccountPortfolio>()

  const updateAccountPortfolio = useCallback(async (address: string) => {
    const identity = await getIdentity(address, fetch, RELAYER_URL)

    if (!identity.creation) {
      setAccountPortfolio({ address, error: 'You are trying to connect a non Ambire v2 account.' })
      return
    }

    // Set the address first, and update the portfolio later, as it takes more time to calculate.
    // In the component where we are using the PortfolioContext, we will display the address first,
    // and while the balance is still being fetched, we will show a loader.
    setAccountPortfolio({ address })

    const portfolio = await getPortfolio(address)

    setAccountPortfolio({ address, ...portfolio })
  }, [])

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
