// TODO: add types
// TODO: fix ignored linter warnings
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState } from 'react-native'

import CONFIG from '@config/env'
import supportedProtocols from '@modules/common/constants/supportedProtocols'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import { fetchGet } from '@modules/common/services/fetch'

type PortfolioContextData = {
  isBalanceLoading: boolean
  areProtocolsLoading: boolean
  balance: any
  otherBalances: any
  tokens: any
  protocols: any
  collectibles: any
  requestOtherProtocolsRefresh: () => void
}

const PortfolioContext = createContext<PortfolioContextData>({
  isBalanceLoading: true,
  areProtocolsLoading: true,
  balance: {
    total: {
      full: 0,
      truncated: 0,
      decimals: '00',
    },
    tokens: [],
  },
  otherBalances: [],
  tokens: [],
  protocols: [],
  collectibles: [],
  requestOtherProtocolsRefresh: () => {},
})

const getBalances = (apiKey: any, network: any, protocol: any, address: any) =>
  fetchGet(
    `${CONFIG.ZAPPER_API_ENDPOINT}/protocols/${protocol}/balances?addresses[]=${address}&network=${network}&api_key=${apiKey}&newBalances=true`
  )

let lastOtherProtocolsRefresh: any = null

const PortfolioProvider: React.FC = ({ children }) => {
  const currentAccount = useRef()
  const appState = useRef(AppState.currentState)

  const [appStateVisible, setAppStateVisible] = useState<any>(appState.current)
  const [isBalanceLoading, setBalanceLoading] = useState<any>(true)
  const [areProtocolsLoading, setProtocolsLoading] = useState<any>(true)

  const [tokensByNetworks, setTokensByNetworks] = useState<any>([])
  const [otherProtocolsByNetworks, setOtherProtocolsByNetworks] = useState<any>([])

  const [balance, setBalance] = useState<any>({
    total: {
      full: 0,
      truncated: 0,
      decimals: '00',
    },
    tokens: [],
  })
  const [otherBalances, setOtherBalances] = useState<any>([])
  const [tokens, setTokens] = useState<any>([])
  const [protocols, setProtocols] = useState<any>([])
  const [collectibles, setCollectibles] = useState<any>([])

  const { network: selectedNetwork } = useNetwork()
  const currentNetwork = selectedNetwork?.id
  const { selectedAcc: account } = useAccounts()

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetchTokens = useCallback(async (account, currentNetwork = false) => {
    try {
      const networks = currentNetwork
        ? [currentNetwork]
        : supportedProtocols.map(({ network }) => network)

      let failedRequests = 0
      const requestsCount = networks.length

      const updatedTokens = (
        await Promise.all(
          networks.map(async (network) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const balance = await getBalances(CONFIG.ZAPPER_API_KEY, network, 'tokens', account)
              if (!balance) return null

              const { meta, products }: any = Object.values(balance)[0]
              return {
                network,
                meta,
                products,
              }
            } catch (_) {
              failedRequests++
            }
          })
        )
      ).filter((data) => data)
      const updatedNetworks = updatedTokens.map(({ network }: any) => network)

      // Prevent race conditions
      if (currentAccount.current !== account) return

      setTokensByNetworks((prevTokensByNetworks: any) => [
        ...prevTokensByNetworks.filter(({ network }: any) => !updatedNetworks.includes(network)),
        ...updatedTokens,
      ])

      if (failedRequests >= requestsCount) throw new Error('Failed to fetch Tokens from Zapper API')
      return true
    } catch (error) {
      console.error(error)
      // TODO: set global error message
      // addToast(error.message, { error: true })
      return false
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetchOtherProtocols = useCallback(async (account, currentNetwork = false) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const protocols = currentNetwork
        ? [supportedProtocols.find(({ network }) => network === currentNetwork)]
        : supportedProtocols

      let failedRequests = 0
      const requestsCount = protocols.reduce(
        // eslint-disable-next-line no-unsafe-optional-chaining
        (acc: any, curr: any) => curr?.protocols?.length + acc,
        0
      )

      const updatedProtocols = (
        await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          protocols.map(async ({ network, protocols }: any) => {
            const all = (
              await Promise.all(
                protocols.map(async (protocol: any) => {
                  try {
                    const bal = await getBalances(CONFIG.ZAPPER_API_KEY, network, protocol, account)
                    return bal ? Object.values(bal)[0] : null
                  } catch (_) {
                    failedRequests++
                  }
                })
              )
            )
              .filter((data: any) => data)
              .flat()

            return all.length
              ? { network, protocols: all.map(({ products }: any) => products).flat(2) }
              : null
          })
        )
      ).filter((data) => data)
      const updatedNetworks = updatedProtocols.map(({ network }: any) => network)

      // Prevent race conditions
      if (currentAccount.current !== account) return

      setOtherProtocolsByNetworks((protocolsByNetworks: any) => [
        ...protocolsByNetworks.filter(({ network }: any) => !updatedNetworks.includes(network)),
        ...updatedProtocols,
      ])

      lastOtherProtocolsRefresh = Date.now()

      if (failedRequests >= requestsCount)
        throw new Error('Failed to fetch other Protocols from Zapper API')
      return true
    } catch (error) {
      console.error(error)
      // TODO: set global error message
      // addToast(error.message, { error: true })
      return false
    }
  }, [])

  const refreshTokensIfVisible = useCallback(() => {
    if (!account) return
    if (!isBalanceLoading) fetchTokens(account, currentNetwork)
  }, [isBalanceLoading, account, fetchTokens, currentNetwork, appStateVisible])

  const requestOtherProtocolsRefresh = async () => {
    if (!account) return
    if (Date.now() - lastOtherProtocolsRefresh > 30000 && !areProtocolsLoading)
      await fetchOtherProtocols(account, currentNetwork)
  }

  // Fetch balances and protocols on account change
  useEffect(() => {
    currentAccount.current = account

    async function loadBalance() {
      if (!account) return
      setBalanceLoading(true)
      if (await fetchTokens(account)) setBalanceLoading(false)
    }

    async function loadProtocols() {
      if (!account) return
      setProtocolsLoading(true)
      if (await fetchOtherProtocols(account)) setProtocolsLoading(false)
    }

    loadBalance()
    loadProtocols()
  }, [account, fetchTokens, fetchOtherProtocols])

  // Update states on network, tokens and otherProtocols change
  useEffect(() => {
    try {
      const balanceByNetworks = tokensByNetworks.map(({ network, meta }: any) => {
        const balanceUSD =
          // eslint-disable-next-line no-unsafe-optional-chaining
          meta.find(({ label }: any) => label === 'Total')?.value +
          // eslint-disable-next-line no-unsafe-optional-chaining
          meta.find(({ label }: any) => label === 'Debt')?.value
        if (!balanceUSD)
          return {
            network,
            total: {
              full: 0,
              truncated: 0,
              decimals: '00',
            },
          }

        const [truncated, decimals] = Number(balanceUSD.toString()).toFixed(2).split('.')
        return {
          network,
          total: {
            full: balanceUSD,
            truncated: Number(truncated).toLocaleString('en-US'),
            decimals,
          },
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const balance = balanceByNetworks.find(({ network }: any) => network === currentNetwork)
      if (balance) {
        setBalance(balance)
        setOtherBalances(balanceByNetworks.filter(({ network }: any) => network !== currentNetwork))
      }

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const tokens = tokensByNetworks.find(({ network }: any) => network === currentNetwork)
      if (tokens)
        setTokens(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          tokens.products.map(({ assets }: any) => assets.map(({ tokens }: any) => tokens)).flat(2)
        )

      const otherProtocols = otherProtocolsByNetworks.find(
        ({ network }: any) => network === currentNetwork
      )
      if (tokens && otherProtocols) {
        setProtocols([
          ...tokens.products,
          ...otherProtocols.protocols.filter(({ label }: any) => label !== 'NFTs'),
        ])
        setCollectibles(
          otherProtocols.protocols.find(({ label }: any) => label === 'NFTs')?.assets || []
        )
      }
    } catch (e) {
      console.error(e)
      // TODO: set global error message
      // addToast(e.message | e, { error: true })
    }
  }, [currentNetwork, tokensByNetworks, otherProtocolsByNetworks])

  // Refresh tokens on network change
  useEffect(() => {
    if (appStateVisible === 'active') {
      refreshTokensIfVisible()
    }
  }, [currentNetwork, refreshTokensIfVisible])

  // Refresh balance every 20s if visible
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (appStateVisible === 'active') {
        refreshTokensIfVisible()
      }
    }, 20000)
    return () => clearInterval(refreshInterval)
  }, [refreshTokensIfVisible])

  // TODO: decide if this is necessary in the mobile use case
  // // Refresh balance every 60s if hidden
  // useEffect(() => {
  //   const refreshIfHidden =
  //     document[hidden] && !isBalanceLoading ? fetchTokens(account, currentNetwork) : null
  //   const refreshInterval = setInterval(refreshIfHidden, 60000)
  //   return () => clearInterval(refreshInterval)
  // }, [account, currentNetwork, isBalanceLoading, fetchTokens])

  // Refresh balance when app is focused
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        refreshTokensIfVisible()
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })
    return () => {
      try {
        subscription?.remove()
      } catch (error) {
        console.log('App state unsubscribe failed')
      }
    }
  }, [])

  return (
    <PortfolioContext.Provider
      value={useMemo(
        () => ({
          isBalanceLoading,
          areProtocolsLoading,
          balance,
          otherBalances,
          tokens,
          protocols,
          collectibles,
          requestOtherProtocolsRefresh,
        }),
        [
          isBalanceLoading,
          areProtocolsLoading,
          balance,
          otherBalances,
          tokens,
          protocols,
          collectibles,
          requestOtherProtocolsRefresh,
        ]
      )}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export { PortfolioContext, PortfolioProvider }
