import React, { FC } from 'react'

import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Address from '@legends/components/Address'
import useAccountContext from '@legends/hooks/useAccountContext'
import styles from '@legends/modules/leaderboard/screens/Leaderboard/Leaderboard.module.scss'
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
    zIndex: isConnectedAccountRow ? 1000 : 0
  }
}

const getBadge = (rank: number) => {
  const rankClasses: {
    [key: number]: string
  } = {
    1: styles.firstPlaceThrophy,
    2: styles.secondPlaceThrophy,
    3: styles.thirdPlaceThrophy
  }

  const className = rankClasses[rank]

  if (className) {
    return <FontAwesomeIcon className={`${styles.trophy} ${className}`} icon={faTrophy} />
  }

  return null
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
        <Address
          skeletonClassName={styles.addressSkeleton}
          address={account}
          maxAddressLength={23}
        />
      </div>
      <h5 className={styles.cell}>{level}</h5>
      <h5 className={styles.cell}>{xp}</h5>
    </div>
  )
}

export default Row
