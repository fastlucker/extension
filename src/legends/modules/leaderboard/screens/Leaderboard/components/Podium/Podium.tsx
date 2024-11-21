import React from 'react'

import Address from '@legends/components/Address'
import useAccountContext from '@legends/hooks/useAccountContext'
import BronzeTrophy from '@legends/modules/leaderboard/screens/Leaderboard/BronzeTrophy'
import GoldTrophy from '@legends/modules/leaderboard/screens/Leaderboard/GoldTrophy'
import SilverTrophy from '@legends/modules/leaderboard/screens/Leaderboard/SilverTrophy'
import { LeaderboardEntry } from '@legends/modules/leaderboard/types'

import styles from './Podium.module.scss'

interface PodiumProps {
  data: Array<LeaderboardEntry>
}

const Podium: React.FC<PodiumProps> = ({ data }) => {
  const { connectedAccount } = useAccountContext()
  return (
    <div className={styles.podium}>
      {data.map((item, index) => (
        <div
          key={`${item.account}-podium`}
          className={`${styles.step} ${styles[`position${index + 1}`]}`}
        >
          <div className={styles.contentWrapper}>
            <img src={item.image_avatar} alt="avatar" className={styles.avatar} />
            {item.account === connectedAccount ? (
              <div className={styles.currentUserWrapper}>
                You
                <div className={styles.currentUserContentWrapper}>
                  (
                  <Address className={styles.name} address={item.account} maxAddressLength={11} />)
                </div>
              </div>
            ) : (
              <Address address={item.account} className={styles.name} maxAddressLength={11} />
            )}
            <h4 className={styles.xp}>{item.xp}</h4>

            {index === 0 && <GoldTrophy width={32} height={29} />}
            {index === 1 && <SilverTrophy />}
            {index === 2 && <BronzeTrophy />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Podium
