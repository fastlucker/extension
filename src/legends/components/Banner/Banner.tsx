import React from 'react'

import styles from './Banner.module.scss'
import governance from './governance.png'

const Banner: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.iconPlaceholder} src={governance} alt="Governance banner icon" />
      <div className={styles.textContent}>
        <div className={styles.title}>
          🛒 Vote is live: Add Bitrefill to Ambire’s App Catalog + 20% cashback on your first order!
        </div>
        <a
          href="https://snapshot.box/#/s:ambire.eth/proposal/0xe9c25d55ec5277147a5a75ec082830bc5feaeb257b66e6409ff3788872867ac0"
          className={styles.readMoreLink}
          target="_blank"
          rel="noreferrer"
        >
          Read more &gt;
        </a>
      </div>
    </div>
  )
}

export default Banner
