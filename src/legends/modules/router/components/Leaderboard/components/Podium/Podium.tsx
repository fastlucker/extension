import React from 'react'

import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Podium.module.scss'

interface PodiumProps {
  first: { account: string; xp: number; avatar: string }
  second: { account: string; xp: number; avatar: string }
  third: { account: string; xp: number; avatar: string }
}

const Podium: React.FC<PodiumProps> = ({ first, second, third }) => {
  return (
    <div className={styles.podium}>
      <div className={`${styles.step} ${styles.second}`}>
        <div className={styles.contentWrapper}>
          <img src="/images/leaderboard/avatar3.png" alt="avatar" className={styles.avatar} />
          <h5 className={styles.name}>goshokazana.x</h5>
          <h4 className={styles.xp}>18 349</h4>
        </div>
      </div>
      <div className={`${styles.step} ${styles.first}`}>
        <div className={styles.contentWrapper}>
          <FontAwesomeIcon className={styles.throphy} icon={faTrophy} />
          <img src="/images/leaderboard/avatar2.png" alt="avatar" className={styles.avatar} />
          <h5 className={styles.name}>elmoto.eth</h5>
          <h4 className={styles.xp}>19 349</h4>
        </div>
      </div>
      <div className={`${styles.step} ${styles.third}`}>
        <div className={styles.contentWrapper}>
          <img src="/images/leaderboard/avatar4.png" alt="avatar" className={styles.avatar} />
          <h5 className={styles.name}>0x66fE...04d08</h5>
          <h4 className={styles.xp}>18 349</h4>
        </div>
      </div>
    </div>
  )
}

export default Podium
