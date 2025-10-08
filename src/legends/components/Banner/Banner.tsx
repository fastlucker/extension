import React from 'react'

import styles from './Banner.module.scss'
import governance from './governance.png'

const Banner: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.iconPlaceholder} src={governance} alt="Governance banner icon" />
      <div className={styles.textContent}>
        <div className={styles.title}>🗳️ Cast your vote for the proposals until October 12!</div>
        <a
          href="https://snapshot.box/#/s:ambire.eth/proposal/0x4063d925ac63f29a35cdd9cc24c098946c0cbcd65ae11f538c76634ca110de65"
          className={styles.readMoreLink}
          target="_blank"
          rel="noreferrer"
        >
          🚀 Update XP for some quests
        </a>
        <br />
        <a
          href="https://snapshot.box/#/s:ambire.eth/proposal/0x80e1135e5ea98924e2200ee2ce6690cb1716d2d3f4a64ceff4f6cda9d1379853"
          className={styles.readMoreLink}
          target="_blank"
          rel="noreferrer"
        >
          🔥 Remove NFT in Rewards
        </a>
      </div>
    </div>
  )
}

export default Banner
