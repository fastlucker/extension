import React from 'react'

import LinesDeco from '@legends/common/assets/svg/LinesDeco'

// @ts-ignore
import backgroundImage from './assets/background.jpg'
import styles from './Connect.module.scss'

const Connect = () => {
  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Become a Legend</h2>
        <button type="button" className={styles.button}>
          <LinesDeco className={styles.topLinesDeco} />
          <div className={styles.buttonInner}>Connect</div>
          <LinesDeco className={styles.bottomLinesDeco} />
        </button>
      </div>
    </div>
  )
}

export default Connect
