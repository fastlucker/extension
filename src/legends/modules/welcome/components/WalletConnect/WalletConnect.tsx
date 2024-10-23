import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import styles from './WalletConnect.module.scss'

const WalletConnect = () => {
  const navigate = useNavigate()
  const { lastConnectedV2Account, error, requestAccounts } = useAccountContext()

  useEffect(() => {
    if (lastConnectedV2Account) {
      navigate(LEGENDS_ROUTES.character)
    }
  }, [lastConnectedV2Account, navigate])

  // If it's connected, don't show the connect button
  if (lastConnectedV2Account) return null

  if (!window.ambire)
    return (
      <>
        <a
          href="https://chromewebstore.google.com/detail/ambire-wallet/ehgjhhccekdedpbkifaojjaefeohnoea?hl=en"
          target="_blank"
          rel="noreferrer"
          className={styles.button}
        >
          Install Ambire
        </a>
        <p className={styles.text}>*Please, reload this tab after installing Ambire</p>
      </>
    )

  return (
    <>
      {error && <p className={styles.error}>⚠️ {error}</p>}
      <button type="button" onClick={requestAccounts} className={styles.button}>
        Connect Ambire
      </button>
      <p className={styles.text}>*Only Ambire V2 accounts can earn points</p>
    </>
  )
}

export default WalletConnect
