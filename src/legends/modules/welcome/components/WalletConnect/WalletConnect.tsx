import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'

const WalletConnect = () => {
  const navigate = useNavigate()
  const { connectedAccount, requestAccounts } = useAccountContext()

  useEffect(() => {
    if (connectedAccount) {
      navigate('/legends')
    }
  }, [connectedAccount, navigate])

  // If it's connected, don't show the connect button
  if (connectedAccount) return null

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
