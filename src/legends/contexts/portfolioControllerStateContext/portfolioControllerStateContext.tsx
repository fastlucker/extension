import React, { createContext, useCallback, useMemo, useRef, useState } from 'react'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import {
  CollectionResult as CollectionResultInterface,
  NetworkNonces as NetworkNoncesInterface,
  TokenAmount as TokenAmountInterface,
  TokenResult as TokenResultInterface
} from '@ambire-common/libs/portfolio/interfaces'
import { calculateAccountPortfolio } from '@ambire-common/libs/portfolio/portfolioView'
import { NetworksController } from '@ambire-common/controllers/networks/networks'
import { storage } from '@web/extension-services/background/webapi/storage'
import { ProvidersController } from '@ambire-common/controllers/providers/providers'
import { AccountsController } from '@ambire-common/controllers/accounts/accounts'
import { RELAYER_URL, VELCRO_URL } from '@env'
import { getIdentity } from '@ambire-common/libs/accountAdder/accountAdder'

// Both interfaces have been copied and slightly modified.
// We'll see how the Legends feature evolves and decide how to reuse them.
export interface AccountPortfolio {
  address: string | null
  tokens: TokenResultInterface[]
  collections: CollectionResultInterface[]
  totalAmount: number
  isAllReady: boolean
  simulationNonces: NetworkNoncesInterface
  tokenAmounts: TokenAmountInterface[]
}

const DEFAULT_ACCOUNT_PORTFOLIO = {
  address: null,
  tokens: [],
  collections: [],
  totalAmount: 0,
  isAllReady: false,
  simulationNonces: {},
  tokenAmounts: []
}

const PortfolioControllerStateContext = createContext<{
  accountPortfolio: AccountPortfolio
  updateAccountPortfolio: (address: string) => void
}>({
  accountPortfolio: DEFAULT_ACCOUNT_PORTFOLIO,
  updateAccountPortfolio: () => {}
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const [accountPortfolio, setAccountPortfolio] =
    useState<AccountPortfolio>(DEFAULT_ACCOUNT_PORTFOLIO)
  const prevAccountPortfolio = useRef<AccountPortfolio>(DEFAULT_ACCOUNT_PORTFOLIO)

  const updateAccountPortfolio = useCallback(async (address: string) => {
    const identity = await getIdentity(address, fetch, RELAYER_URL)

    if (!identity.creation) {
      setAccountPortfolio(DEFAULT_ACCOUNT_PORTFOLIO)
      // eslint-disable-next-line no-alert
      alert('You are trying to connect a non Ambire v2 account.')
      return
    }

    // Set the address first, and update the portfolio later, as it takes more time to calculate.
    // In the component where we are using the PortfolioContext, we will display the address first,
    // and while the balance is still being fetched, we will show a loader.
    setAccountPortfolio({ ...DEFAULT_ACCOUNT_PORTFOLIO, address })

    const networksController = new NetworksController(
      storage,
      fetch,
      // We don't add callbacks here, as the Legends app is not aware if a network is being added in the extension.
      async () => {},
      () => {}
    )

    const providersController = new ProvidersController(networksController)

    const accountsController = new AccountsController(
      storage,
      providersController,
      networksController,
      // We don't add a callback here, as this is the role of the extension.
      // Every time a new account is set in the extension, we simply reload Legends and fetch everything anew.
      async () => {},
      providersController.updateProviderIsWorking.bind(providersController)
    )

    await accountsController.addAccounts([
      {
        addr: address,
        creation: identity.creation,
        initialPrivileges: identity.initialPrivileges,
        associatedKeys: identity.associatedKeys,
        preferences: {
          label: 'Legends view-only',
          pfp: address
        }
      }
    ])

    const portfolioController = new PortfolioController(
      storage,
      fetch,
      providersController,
      networksController,
      accountsController,
      RELAYER_URL,
      VELCRO_URL
    )

    await portfolioController.updateSelectedAccount(address, undefined, undefined, {
      forceUpdate: true
    })

    const newAccountPortfolio = calculateAccountPortfolio(
      address,
      portfolioController,
      prevAccountPortfolio?.current,
      false
    )

    setAccountPortfolio({
      address,
      ...newAccountPortfolio
    })
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
