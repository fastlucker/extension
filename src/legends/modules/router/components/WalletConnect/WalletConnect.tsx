import React, { useCallback, useEffect } from 'react'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

const WalletConnect = () => {
  const { accountPortfolio, updateAccountPortfolio } = usePortfolioControllerState()

  const connectAccount = useCallback(async () => {
    const accounts = await window.ambire.request({
      method: 'eth_requestAccounts',
      params: []
    })

    // @ts-ignore
    updateAccountPortfolio(accounts[0])
  }, [updateAccountPortfolio])

  useEffect(() => {
    if (window.ambire?.isConnected() && window.ambire.selectedAddress) {
      updateAccountPortfolio(window.ambire.selectedAddress)
    }
  }, [updateAccountPortfolio])

  // On Account change, set the new Legends address and fetch its portfolio.
  useEffect(() => {
    // The `accountsChanged` event is fired even when the account is changed or disconnected by the extension.
    // Because of this, we check later whether `isConnected` or not.
    window.ambire?.on('accountsChanged', async () => {
      if (window.ambire.isConnected() && window.ambire.selectedAddress) {
        await connectAccount()
      } else {
        // If the account is disconnected, we simply reload Legends, as we don't persist any state in the storage.
        window.location.reload()
      }
    })

    return () => {
      window.ambire.removeListener('accountsChanged', connectAccount)
    }
  }, [connectAccount])

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
    <button type="button" onClick={connectAccount} style={{ display: 'flex' }}>
      Connect your Ambire v2 account
    </button>
  )
}

export default WalletConnect
