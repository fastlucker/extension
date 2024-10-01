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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio dui. Nullam a
          consectetur massa, at placerat dolor. Pellentesque eu imperdiet enim. Suspendisse
          fringilla faucibus ipsum, sit amet blandit libero eleifend vel. Suspendisse faucibus
          placerat est non convallis. Mauris vel magna laoreet, convallis lacus eu, bibendum metus.
          Mauris convallis quam eu justo vestibulum convallis. Praesent nisi nisl, bibendum ac
          pharetra non, varius at arcu.
        </p>
        <p className={styles.text}>
          Mauris vel magna laoreet, convallis lacus eu, bibendum metus. Mauris convallis quam eu
          justo vestibulum convallis. Praesent nisi nisl, bibendum ac pharetra non, varius at arcu.
        </p>
      </div>
      <div className={styles.mb}>
        <h2 className={styles.subtitle}>Rewards Pool</h2>
        <p className={styles.text}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, veniam repellendus possimus
          sunt officia assumenda harum tempore fugit eaque molestias.
        </p>
      </div>
      <div className={styles.mbLg}>
        <h2 className={styles.subtitle}>Rules</h2>
        <p className={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio dui. Suspendisse
          fringilla faucibus ipsum, sit amet blandit libero eleifend vel. Suspendisse faucibus
          placerat est non convallis.
        </p>
      </div>

      <h2 className={styles.subtitleLg}>Are you ready to earn stkWALLET?</h2>
      <WalletConnect />
    </div>
  )
}

export default Welcome
