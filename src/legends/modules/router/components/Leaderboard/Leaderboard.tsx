import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Page from '@legends/components/Page'

import Podium from './components/Podium'
import { getLeaderboard } from './helpers'
import styles from './Leaderboard.module.scss'

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

const LeaderboardContainer: React.FC = () => {
  // TODO: Implement the leaderboard loading state
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<
    Array<{ rank: number; account: string; level: number; xp: number }>
  >([])
  const [userLeaderboardData, setUserLeaderboardData] = useState<{
    rank: number
    account: string
    xp: number
    level: number
  } | null>(null)

  const tableRef = useRef<HTMLDivElement>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const currentUserRef = useRef<HTMLDivElement>(null)

  const [stickyPosition, setStickyPosition] = useState<'top' | 'bottom' | null>(null)

  const calculateRowStyle = (item: {
    rank: number
    account: string
    level: number
    xp: number
  }) => {
    return {
      position:
        userLeaderboardData && item.account === userLeaderboardData.account && stickyPosition
          ? ('sticky' as 'sticky')
          : ('relative' as 'relative'),
      top:
        stickyPosition === 'top' &&
        userLeaderboardData &&
        item.account === userLeaderboardData.account
          ? 0
          : 'auto',
      bottom:
        stickyPosition === 'bottom' &&
        userLeaderboardData &&
        item.account === userLeaderboardData.account
          ? 0
          : 'auto',
      zIndex: userLeaderboardData && item.account === userLeaderboardData.account ? 1000 : 0
    }
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { leaderboard, currentUser } = await getLeaderboard()

        setLeaderboardData(leaderboard)
        currentUser && setUserLeaderboardData(currentUser)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const sortedData = useMemo(
    () =>
      [
        ...leaderboardData,
        (userLeaderboardData &&
          !leaderboardData.find((user) => user.account === userLeaderboardData.account) &&
          userLeaderboardData) ||
          []
      ]
        .flat()
        .sort((a, b) => b.xp - a.xp),
    [leaderboardData, userLeaderboardData]
  )

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!userLeaderboardData || !currentUserRef.current) return

      const userRect = currentUserRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Check if the current user's row is above the viewport (scrolling down)
      if (userRect.top < 0) {
        // If the user is above the viewport, pin to the top
        setStickyPosition('top')
      } else if (userRect.bottom > windowHeight) {
        // If the user is below the viewport, pin to the bottom
        setStickyPosition('bottom')
      } else {
        // Reset sticky behavior when the current user's row is in the viewport
        setStickyPosition(null)
      }
    }

    const pageElement = pageRef.current
    if (pageElement) {
      // Attach the scroll event listener
      pageElement.addEventListener('scroll', handleScroll)

      // Trigger the handleScroll function immediately after component mount
      handleScroll()
    }

    return () => {
      if (pageElement) {
        // Clean up the event listener on component unmount
        pageElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentUserRef, sortedData, userLeaderboardData])

  return (
    <Page pageRef={pageRef}>
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id nisl fringilla,
            aliquet elit sit amet, feugiat nisi. Vestibulum condimentum aliquet tortor, eu laoreet
            magna luctus et.
          </p>
        </div>
        <Podium data={sortedData.slice(0, 3)} />
        <div ref={tableRef} className={styles.table}>
          <div className={styles.header}>
            <h5 className={styles.cell}>player</h5>
            <h5 className={styles.cell}>Level</h5>
            <h5 className={styles.cell}>XP</h5>
          </div>
          {sortedData.map((item) => (
            <div
              key={item.account}
              className={`${styles.row} ${
                userLeaderboardData && item.account === userLeaderboardData.account
                  ? styles.currentUserRow
                  : ''
              } ${item.rank <= 3 ? styles[`rankedRow${item.rank}`] : ''}`}
              ref={
                userLeaderboardData && item.account === userLeaderboardData.account
                  ? currentUserRef
                  : null
              }
              style={calculateRowStyle(item)}
            >
              <div className={styles.rankWrapper}>
                {item.rank > 3 ? item.rank : getBadge(item.rank)}
              </div>
              <div className={styles.cell}>
                {/* TODO: Replace the avatar image with the actual avatar - nft */}
                <img src="/images/leaderboard/avatar1.png" alt="avatar" className={styles.avatar} />
                {/* TODO: Add ens here instead of address */}
                {shortenAddress(item.account, 23)}
              </div>
              <h5 className={styles.cell}>{item.level}</h5>
              <h5 className={styles.cell}>{item.xp}</h5>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

export default LeaderboardContainer
