import React from 'react'

import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FarcasterIcon from '@legends/common/assets/svg/FarcasterIcon'
import LinesDeco2 from '@legends/common/assets/svg/LinesDeco2'

import styles from './Footer.module.scss'

const SOCIALS = [
  {
    name: 'Telegram',
    icon: faTelegram,
    url: 'https://t.me/AmbireOfficial'
  },
  {
    name: 'X',
    icon: faXTwitter,
    url: 'https://x.com/AmbireWallet'
  },
  {
    name: 'Discord',
    icon: faDiscord,
    url: 'https://discord.com/invite/Ambire'
  }
]

const Footer = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.socialsWrapper}>
        <LinesDeco2 className={styles.topDeco} />
        <div className={styles.socials}>
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
            >
              <FontAwesomeIcon icon={social.icon} />
            </a>
          ))}
          <a
            href="https://warpcast.com/ambirewallet"
            target="_blank"
            rel="noreferrer"
            className={styles.social}
          >
            <FarcasterIcon />
          </a>
        </div>
        <LinesDeco2 className={styles.bottomDeco} />
      </div>
      <div className={styles.bottom}>
        <span className={styles.copyright}>
          Copyright © 2024 Ambire Wallet. All Rights Reserved
        </span>
      </div>
    </div>
  )
}

export default Footer
