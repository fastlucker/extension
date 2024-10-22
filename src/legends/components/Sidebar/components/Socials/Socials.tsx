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
        title="Ambire Discord Server"
        text="Join our Discord server for support and announcements."
      >
        <a
          target="_blank"
          href="https://www.ambire.com/discord"
          className={styles.discordLink}
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faDiscord} />
          Join Discord
        </a>
      </HighlightedLink>
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
