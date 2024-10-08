import React from 'react'

import WalletConnect from '@legends/modules/welcome/components/WalletConnect'

import styles from './Welcome.module.scss'

const Welcome = () => {
  return (
    <div className={styles.wrapper}>
      <img src="/images/logo.png" alt="Ambire Logo" className={styles.logo} />
      <div className={styles.mb}>
        <h1 className={styles.title}>Welcome to Ambire Legends</h1>
        <p className={`${styles.text} ${styles.textMb}`}>
          <ul>
            <li>#1. Connect your Ambire v2 smart account and start completing quests.</li>
            <li>#2. You can choose a character that starts at level 0.</li>
            <li>#3. By completing quests, you’ll earn XP to level up your character.</li>
          </ul>
        </p>
        <p className={`${styles.text} ${styles.textMb}`}>
          ⚠️ Please note that this is an early prototype of Legends, intended for testing purposes
          only.
        </p>
        <p className={`${styles.text} ${styles.textMb}`}>🚀 Have fun and happy testing!</p>
      </div>
      <h2 className={styles.subtitleLg}>Are you ready to earn $WALLET?</h2>
      <WalletConnect />
    </div>
  )
}

export default Welcome
