import React from 'react'

import styles from './Banner.module.scss'
import governance from './governance.png'

const Banner: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.iconPlaceholder} src={governance} alt="Governance banner icon" />
      <div className={styles.textContent}>
        <div className={styles.title}>
          Governance vote for Season 1 allocation is in discussion.
        </div>
        <a
          href="https://blog.ambire.com/p/667d3361-b91d-4a48-8101-2b09e81366dd/"
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
