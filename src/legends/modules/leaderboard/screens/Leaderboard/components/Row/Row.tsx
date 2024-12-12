import React, { FC } from 'react'

import Address from '@legends/components/Address'
import useAccountContext from '@legends/hooks/useAccountContext'
import BronzeTrophy from '@legends/modules/leaderboard/screens/Leaderboard/BronzeTrophy'
import GoldTrophy from '@legends/modules/leaderboard/screens/Leaderboard/GoldTrophy'
import styles from '@legends/modules/leaderboard/screens/Leaderboard/Leaderboard.module.scss'
import SilverTrophy from '@legends/modules/leaderboard/screens/Leaderboard/SilverTrophy'
import { LeaderboardEntry } from '@legends/modules/leaderboard/types'

type Props = LeaderboardEntry & {
  stickyPosition: string | null
  currentUserRef: React.RefObject<HTMLDivElement>
}

const calculateRowStyle = (isConnectedAccountRow: boolean, stickyPosition: string | null) => {
  return {
    position: (isConnectedAccountRow && stickyPosition ? 'sticky' : 'relative') as
      | 'sticky'
      | 'relative',
    top: stickyPosition === 'top' && isConnectedAccountRow ? 0 : 'auto',
    bottom: stickyPosition === 'bottom' && isConnectedAccountRow ? 0 : 'auto',
    zIndex: isConnectedAccountRow ? 10 : 0
  }
}

const getBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <GoldTrophy className={styles.trophy} />
    case 2:
      return <SilverTrophy className={styles.trophy} />
    case 3:
      return <BronzeTrophy className={styles.trophy} />
    default:
      return null
  }
}

const Row: FC<Props> = ({
  account,
  image_avatar,
  rank,
  xp,
  level,
  stickyPosition,
  currentUserRef
}) => {
  const { connectedAccount } = useAccountContext()
  const isConnectedAccountRow = account === connectedAccount

  return (
    <div
      key={account}
      className={`${styles.row} ${isConnectedAccountRow ? styles.currentUserRow : ''} ${
        rank <= 3 ? styles[`rankedRow${rank}`] : ''
      }`}
      ref={isConnectedAccountRow ? currentUserRef : null}
      style={calculateRowStyle(isConnectedAccountRow, stickyPosition)}
    >
      <div className={styles.rankWrapper}>{rank > 3 ? rank : getBadge(rank)}</div>
      <div className={styles.cell}>
        <img src={image_avatar} alt="avatar" className={styles.avatar} />
        {isConnectedAccountRow ? (
          <>
            You (
            <Address
              skeletonClassName={styles.addressSkeleton}
              className={styles.address}
              address={account}
              maxAddressLength={23}
            />
            )
          </>
        ) : (
          <Address
            skeletonClassName={styles.addressSkeleton}
            className={styles.address}
            address={account}
            maxAddressLength={23}
          />
        )}
      </div>
      <h5 className={styles.cell}>{level}</h5>
      <h5 className={styles.cell}>{xp}</h5>
    </div>
  )
}

export default Row
