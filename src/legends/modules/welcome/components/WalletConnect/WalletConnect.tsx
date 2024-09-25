import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

const WalletConnect = () => {
  const navigate = useNavigate()
  const { accountPortfolio, updateAccountPortfolio } = usePortfolioControllerState()

  const requestAccounts = useCallback(async () => {
    if (!window.ambire) return
    await window.ambire.request({
      method: 'eth_requestAccounts',
      params: []
    })
  }, [])

  const getConnectedAccount = useCallback(async (): Promise<string | undefined> => {
    if (!window.ambire) return
    const accounts = await window.ambire.request({
      method: 'eth_accounts',
      params: []
    })

    // @ts-ignore
    return accounts[0]
  }, [])

  const onConnect = useCallback(
    (account: string) => {
      updateAccountPortfolio(account)
      navigate('/legends')
    },
    [navigate, updateAccountPortfolio]
  )

  // On Account connect or change set the new Legends address and fetch its portfolio,
  // while on Account disconnect, we simply reload the Legends, which resets all the hooks state.
  useEffect(() => {
    const onAccountsChanged = async (accounts: string[]) => {
      const account = accounts[0]

      if (account) {
        onConnect(account)
      } else {
        // If the account is disconnected, we simply reload Legends, as we don't persist any state in the storage.
        window.location.reload()
      }
    }

    getConnectedAccount()
      .then((account) => {
        if (account) onConnect(account)
      })
      .catch(() => console.error('Error fetching connected account'))

    // The `accountsChanged` event is fired when the account is connected, changed or disconnected by the extension.
    window.ambire?.on('accountsChanged', onAccountsChanged)

    return () => {
      window.ambire.removeListener('accountsChanged', onAccountsChanged)
    }
  }, [getConnectedAccount, onConnect, updateAccountPortfolio])

  // If it's connected, don't show the connect button
  if (accountPortfolio) return null

  if (!window.ambire)
    return (
      <div>
        The Ambire extension is not installed, and you cannot proceed with Legends.{' '}
        <a
          href="https://chromewebstore.google.com/detail/ambire-wallet/ehgjhhccekdedpbkifaojjaefeohnoea?hl=en"
          target="_blank"
          rel="noreferrer"
        >
          Get Ambire!
        </a>
      </div>
    )

  return (
    <button type="button" onClick={requestAccounts} style={{ display: 'flex' }}>
      Connect your Ambire v2 account
    </button>
  )
}

export default WalletConnect
