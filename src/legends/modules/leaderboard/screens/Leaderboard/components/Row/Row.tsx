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
    zIndex: isConnectedAccountRow ? 10 : 0
  }
}

const getBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <FontAwesomeIcon icon={faTrophy} className={styles.trophy} />
    case 2:
      return <FontAwesomeIcon icon={faTrophy} className={styles.trophy} />
    case 3:
      return <FontAwesomeIcon icon={faTrophy} className={styles.trophy} />
    default:
      return null
  }
}

function prettifyWeight(weight: number) {
  if (weight > 1_000) return `${(weight / 1_000).toFixed(2)}K`
  if (weight > 1_000_000) return `${(weight / 1_000_000).toFixed(2)}M`
  if (weight > 1_000_000_000) return `${(weight / 1_000_000_000).toFixed(2)}B`
  return Math.floor(weight)
}

const Row: FC<Props> = ({
  account,
  image_avatar,
  rank,
  xp,
  weight,
  level,
  stickyPosition,
  currentUserRef
}) => {
  const { connectedAccount } = useAccountContext()
  const isConnectedAccountRow = account === connectedAccount

  const formatXp = (xp: number) => {
    const str = xp.toString()
    return `${str.slice(0, 2)} ${str.slice(2)}`
  }

  const formattedXp = formatXp(xp)
  return (
    <div
      key={account}
      className={`${styles.row} ${isConnectedAccountRow ? styles.currentUserRow : ''} ${
        rank <= 3 ? styles[`rankedRow${rank}`] : ''
      }`}
      ref={isConnectedAccountRow ? currentUserRef : null}
      style={calculateRowStyle(isConnectedAccountRow, stickyPosition)}
    >
      <div className={styles.cell}>
        <div className={styles.rankWrapper}>{rank > 3 ? rank : getBadge(rank)}</div>
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
      <h5 className={`${styles.cell} ${styles.weight}`}>{prettifyWeight(weight || 0)}</h5>
      <h5 className={styles.cell}>{formattedXp}</h5>
    </div>
  )
}

export default Row
