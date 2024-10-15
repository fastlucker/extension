import React from 'react'

import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Address from '@legends/components/Address'
import { LeaderboardEntry } from '@legends/modules/leaderboard/types'

import styles from './Podium.module.scss'

interface PodiumProps {
  data: Array<LeaderboardEntry>
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
            {index === 0 && <FontAwesomeIcon className={styles.trophy} icon={faTrophy} />}
            <img src={item.image_avatar} alt="avatar" className={styles.avatar} />
            <Address address={item.account} className={styles.name} maxAddressLength={11} />
            <h4 className={styles.xp}>{item.xp}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Podium
