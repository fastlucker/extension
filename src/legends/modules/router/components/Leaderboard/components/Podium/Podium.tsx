import React from 'react'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Podium.module.scss'

interface PodiumProps {
  data: Array<{ account: string; xp: number }>
}

const Podium: React.FC<PodiumProps> = ({ data }) => {
  return (
    <div className={styles.podium}>
      {data.map((item, index) => (
        <div
          key={`${item.account}-podium`}
          className={`${styles.step} ${styles[`position${index + 1}`]}`}
        >
          <div className={styles.contentWrapper}>
            {index === 0 && <FontAwesomeIcon className={styles.throphy} icon={faTrophy} />}
            <img src="/images/leaderboard/avatar2.png" alt="avatar" className={styles.avatar} />
            <h5 className={styles.name}>{shortenAddress(item.account, 11)}</h5>
            <h4 className={styles.xp}>{item.xp}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Podium
