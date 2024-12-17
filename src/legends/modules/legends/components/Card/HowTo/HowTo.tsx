import React, { FC } from 'react'

import CopyIcon from '@common/assets/svg/CopyIcon'
import { CardFromResponse } from '@legends/modules/legends/types'

import YouTubeVideo from './components/YouTubeVideo'
import styles from './HowTo.module.scss'

type Props = {
  steps: string[]
  image?: string
  imageAlt?: string
  video?: string
  meta?: CardFromResponse['meta']
  copyToClipboard?: () => void
}

const HowTo: FC<Props> = ({ steps, image, imageAlt, meta, copyToClipboard, video }) => {
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
        {video && <YouTubeVideo className={styles.video} src={video} />}
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
                    <div>
                      🤑Join the biggest airdrop a WALLET <br />
                      has ever done! 🚀{' '}
                    </div>
                    <button type="button" onClick={copyToClipboard}>
                      <CopyIcon className={styles.copyIcon} />
                    </button>
                  </div>
                  <br />
                  Ambire Wallet is giving away 195M $WALLET tokens through the Ambire Legends
                  campaign. All activity with a Smart Account on 5 of the hottest EVM chains is
                  rewarded. Start strong with the first 4 transactions free! <br /> <br />
                  Here’s what you need to do:
                  <br /> 1. Download the Ambire extension{' '}
                  <a
                    target="_blank"
                    href="https://www.ambire.com/get-extension"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    here
                  </a>
                  <br /> 2. Use my referral code so we both get XP:{' '}
                  <span className={styles.boldText}>{meta?.invitationKey}</span>
                  <br /> 3. Create a Smart Account in the extension and join{' '}
                  <a
                    target="_blank"
                    href="https://legends.ambire.com/"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    Ambire Legends
                  </a>
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
