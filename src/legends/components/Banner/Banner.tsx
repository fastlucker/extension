import React from 'react'

import styles from './Banner.module.scss'
import governance from './governance.png'

const Banner: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.iconPlaceholder} src={governance} alt="Governance banner icon" />
      <div className={styles.textContent}>
        <div className={styles.title}>🗳️ Cast your vote for the proposals until October 18!</div>
        <a
          href="https://snapshot.box/#/s:ambire.eth/proposal/0x2f6992e51015e6781b529ddc6cff1a8e752ad4b16b750c1b27e6a9b3168c87e0"
          className={styles.readMoreLink}
          target="_blank"
          rel="noreferrer"
        >
          🚀 Double XP for activity on Ethereum
        </a>
        <br />
        <a
          href="https://snapshot.box/#/s:ambire.eth/proposal/0x006a5dd1db40fc48a5f78cfe9f9aa2920df17d83a141d2d32dc65828f9358dd9"
          className={styles.readMoreLink}
          target="_blank"
          rel="noreferrer"
        >
          🔥 Increase XP for governance participation
        </a>
      </div>
    </div>
  )
}

export default Banner
