import React from 'react'

import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import HighlightedLink from '../HighlightedLink'
import styles from './Socials.module.scss'

const Socials = () => {
  return (
    <div className={styles.wrapper}>
      <HighlightedLink
        onClick={() => {}}
        title="Ambire Discord Server"
        text="Join our Discord server for support and announcements."
        buttonText="Join Discord"
        buttonIcon={faDiscord}
      />
      <div className={styles.socials}>
        <a
          href="https://t.me/AmbireOfficial"
          target="_blank"
          rel="noreferrer"
          className={styles.social}
        >
          <FontAwesomeIcon icon={faTelegram} />
        </a>
        <a
          href="https://x.com/AmbireWallet"
          target="_blank"
          rel="noreferrer"
          className={styles.social}
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </div>
    </div>
  )
}

export default Socials
