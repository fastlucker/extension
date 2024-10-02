import React, { createContext, useCallback, useEffect, useMemo } from 'react'

const accountContext = createContext<{
  connectedAccount: string | null
  requestAccounts: () => void
  disconnectAccount: () => void
}>({
  connectedAccount: null,
  requestAccounts: () => {},
  disconnectAccount: () => {}
})

const AccountContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedAccount, setConnectedAccount] = React.useState<string | null>(null)

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

  // On Account connect or change set the new Legends address and fetch its portfolio,
  // while on Account disconnect, we simply reload the Legends, which resets all the hooks state.
  useEffect(() => {
    const onAccountsChanged = async (accounts: string[]) => {
      setConnectedAccount(accounts[0])
    }

    getConnectedAccount()
      .then((account) => {
        setConnectedAccount(account)
      })
      .catch(() => console.error('Error fetching connected account'))

    // The `accountsChanged` event is fired when the account is connected, changed or disconnected by the extension.
    window.ambire?.on('accountsChanged', onAccountsChanged)

    return () => {
      window.ambire.removeListener('accountsChanged', onAccountsChanged)
    }
  }, [getConnectedAccount])

  const contextValue = useMemo(
    () => ({
      connectedAccount,
      requestAccounts,
      disconnectAccount
    }),
    [connectedAccount, requestAccounts, disconnectAccount]
  )

  return <accountContext.Provider value={contextValue}>{children}</accountContext.Provider>
}

export { AccountContextProvider, accountContext }
