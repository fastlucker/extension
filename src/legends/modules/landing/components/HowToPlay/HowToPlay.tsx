import React from 'react'

import Title from '@legends/modules/landing/components/Title'

import step1Image from './assets/step1.png'
import step2Image from './assets/step2.png'
import step3Image from './assets/step3.png'
import styles from './HowToPlay.module.scss'

const HowToPlay = () => {
  return (
    <div className={styles.wrapper}>
      <Title title="How to Play Ambire Legends" className={styles.title} />
      <div className={styles.steps}>
        <div className={styles.step}>
          <img src={step1Image} alt="Step 1" className={styles.stepImage} />
          <h3 className={styles.stepTitle}>1. Get the Ambire Wallet Extension</h3>
          <p className={styles.stepText}>
            If you don’t have the Ambire Extension, go to{' '}
            <a href="https://ambire.com/get-extension" target="_blank" rel="noreferrer">
              ambire.com/get-extension
            </a>{' '}
            and download it.
          </p>
          <p className={styles.stepDisclaimer}>
            To unlock the extension, <strong>you will need a code</strong>. Codes are distributed to
            the Ambire community on{' '}
            <a href="https://ambire.com/discord" target="_blank" rel="noreferrer">
              Discord
            </a>{' '}
            and{' '}
            <a href="https://t.me/AmbireOfficial" target="_blank" rel="noreferrer">
              Telegram
            </a>{' '}
            and early users.
          </p>
        </div>
        <div className={styles.step}>
          <img src={step2Image} alt="Step 2" className={styles.stepImage} />
          <h3 className={styles.stepTitle}>2. Create a Smart Account</h3>
          <p className={styles.stepText}>
            Import your existing seed phrase, create a new one, or
            <strong>connect a hardware wallet</strong> to derive a Smart Account.
          </p>
          <p className={styles.stepDisclaimer}>
            If you already have an Ambire Smart Account created with the extension, go to step 3.
          </p>
        </div>
        <div className={styles.step}>
          <img src={step3Image} alt="Step 3" className={styles.stepImage} />
          <h3 className={styles.stepTitle}>3. Connect your Wallet</h3>
          <p className={styles.stepText}>
            Connect your Smart Account wallet and choose a character to begin the onchain adventure.
          </p>
          <p className={styles.stepDisclaimer}>
            Ambire Legends is accessible to Ambire Extension wallets.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HowToPlay
