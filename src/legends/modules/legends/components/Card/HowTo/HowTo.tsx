import React, { FC } from 'react'

import CopyIcon from '@common/assets/svg/CopyIcon'

import styles from './HowTo.module.scss'

type Props = {
  steps: string[]
  image?: string
  imageAlt?: string
}

const HowTo: FC<Props> = ({ steps, image, imageAlt, meta, copyToClipboard }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <div key={step} className={styles.step}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepTitle}>{step}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.column}>
        {image && !meta && <img className={styles.image} src={image} alt={imageAlt} />}
        {meta && (
          <div className={styles.copySection}>
            <p>
              You have three wishes... No! Better yet, you have five invitations! Send them to
              friends, but choose wisely how to invite them.
            </p>
            <br />
            <p>Here is an example:</p>

            <div className={styles.copySectionWrapper}>
              <div className={styles.copyField}>
                <div>
                  <div className={styles.copyHeader}>
                    <div>⚠️ I have an offer for you that you can&apos;t resist ⚠️ </div>
                    <CopyIcon className={styles.copyIcon} onClick={copyToClipboard} />
                  </div>
                  You download Ambire, we both win 🎉 <br /> 1. Download the Ambire extension:{' '}
                  <a
                    target="_blank"
                    href="https://www.ambire.com/get-extension"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    https://www.ambire.com/get-extension
                  </a>
                  <br /> 2. Use my referral code so we both get XP: {meta?.invitationKey} <br /> 3.
                  Join Ambire Legends - on-chain quests by Ambire with XP and rewards:{' '}
                  <a
                    target="_blank"
                    href="https://legends.ambire.com/"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    https://legends.ambire.com/{' '}
                  </a>
                  <br />
                  There, you can experience the power of Smart Accounts and EOAs in one place. You
                  can approve and swap in one go, enjoy gasless transactions without needing ETH for
                  gas, and sign multiple transactions, saving gas and time, and more!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HowTo
