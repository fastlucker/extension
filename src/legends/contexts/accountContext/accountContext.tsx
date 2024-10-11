import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import { getIdentity } from '@ambire-common/libs/accountAdder/accountAdder'
import { RELAYER_URL } from '@env'

const accountContext = createContext<{
  lastConnectedV2Account: string | null
  connectedAccount: string | null
  chainId: bigint | null
  isConnectedAccountV2: boolean
  isLoading: boolean
  error: string | null
  requestAccounts: () => void
  disconnectAccount: () => void
}>({
  lastConnectedV2Account: null,
  connectedAccount: null,
  chainId: null,
  isConnectedAccountV2: false,
  isLoading: true,
  error: null,
  requestAccounts: () => {},
  disconnectAccount: () => {}
})

const LOCAL_STORAGE_ACC_KEY = 'connectedAccount'

const AccountContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastConnectedV2Account, setLastConnectedV2Account] = React.useState<string | null>(() => {
    const storedAccount = localStorage.getItem(LOCAL_STORAGE_ACC_KEY)

    return storedAccount || null
  })
  const [chainId, setChainId] = React.useState<bigint | null>(null)
  const [connectedAccount, setConnectedAccount] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const requestAccounts = useCallback(async () => {
    if (!window.ambire) return
    await window.ambire.request({
      method: 'eth_requestAccounts',
      params: []
    })
  }, [])

  const disconnectAccount = useCallback(() => {
    alert('TODO: disconnect logic')
    // TODO: disconnect logic
  }, [])

  const getConnectedAccount = useCallback(async (): Promise<string | null> => {
    if (!window.ambire) return null
    const accounts = await window.ambire.request({
      method: 'eth_accounts',
      params: []
    })

    // @ts-ignore
    return accounts[0]
  }, [])

  const getChainId = useCallback(async (): Promise<bigint | null> => {
    if (!window.ambire) return null

    const connectedOnChainId = await window.ambire.request({
      method: 'eth_chainId',
      params: []
    })

    if (typeof connectedOnChainId !== 'string') return null

    return BigInt(connectedOnChainId)
  }, [])

  const validateAndSetAccount = useCallback(
    async (address: string) => {
      setConnectedAccount(address)
      const identity = await getIdentity(address, fetch as any, RELAYER_URL)

      if (!identity.creation) {
        if (!lastConnectedV2Account) {
          setError('You are trying to connect a non Ambire v2 account. Please switch your account!')
        }
        return
      }

      setError(null)
      setLastConnectedV2Account(address)
      localStorage.setItem(LOCAL_STORAGE_ACC_KEY, address)
    },
    [lastConnectedV2Account]
  )

  useEffect(() => {
    getChainId()
      .then((newChainId) => {
        if (newChainId) setChainId(newChainId)
      })
      .catch((e) => console.error('Error fetching chainId', e))

    const onChainChanged = (newChainId: string) => setChainId(BigInt(newChainId))

    window.ambire?.on('chainChanged', onChainChanged)

    return () => {
      window.ambire.removeListener('chainChanged', onChainChanged)
    }
  }, [getChainId])

  // On Account connect or change set the new Legends address and fetch its portfolio,
  // while on Account disconnect, we simply reload the Legends, which resets all the hooks state.
  useEffect(() => {
    const onAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        setConnectedAccount(null)
        setLastConnectedV2Account(null)
        setIsLoading(false)
        localStorage.removeItem(LOCAL_STORAGE_ACC_KEY)
        return
      }

      await validateAndSetAccount(accounts[0])
      setIsLoading(false)
    }

    getConnectedAccount()
      .then(async (account) => {
        if (!account) {
          localStorage.removeItem(LOCAL_STORAGE_ACC_KEY)
          setIsLoading(false)
          return
        }

        await validateAndSetAccount(account)
        setIsLoading(false)
      })
      .catch(() => console.error('Error fetching connected account'))

    // The `accountsChanged` event is fired when the account is connected, changed or disconnected by the extension.
    window.ambire?.on('accountsChanged', onAccountsChanged)

    return () => {
      window.ambire.removeListener('accountsChanged', onAccountsChanged)
    }
  }, [getConnectedAccount, validateAndSetAccount])

  const contextValue = useMemo(
    () => ({
      lastConnectedV2Account,
      connectedAccount,
      isConnectedAccountV2: connectedAccount === lastConnectedV2Account,
      error,
      requestAccounts,
      disconnectAccount,
      chainId,
      isLoading
    }),
    [
      lastConnectedV2Account,
      connectedAccount,
      error,
      requestAccounts,
      disconnectAccount,
      chainId,
      isLoading
    ]
  )

  return <accountContext.Provider value={contextValue}>{children}</accountContext.Provider>
}

export { AccountContextProvider, accountContext }
