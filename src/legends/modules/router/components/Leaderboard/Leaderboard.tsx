import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import { fetchCaught } from '@common/services/fetch'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Page from '@legends/components/Page'

import Podium from './components/Podium'
import styles from './Leaderboard.module.scss'

interface LeaderboardResponse {
  leaderboard: Array<{ rank: number; account: string; level: number; xp: number; avatar: string }>
  currentUser: { rank: number; account: string; xp: number; level: number }
}

const getLeaderboard = async (currentUser?: string): Promise<LeaderboardResponse> => {
  try {
    const res = await fetchCaught(
      `https://staging-relayer.ambire.com/legends/leaderboard${
        currentUser ? `?identity=${currentUser}` : ''
      }`
    )
    return res.body
  } catch {
    console.error('Error fetching leaderboard')
    return { leaderboard: [], currentUser: { rank: 0, account: '', xp: 0, level: 0 } }
  }
}

const getBadge = (rank: number) => {
  if (rank === 1)
    return (
      <FontAwesomeIcon
        className={`${styles.throphy} ${styles.firstPlaceThrophy}`}
        icon={faTrophy}
      />
    )
  if (rank === 2)
    return (
      <FontAwesomeIcon
        className={`${styles.throphy} ${styles.secondPlaceThrophy}`}
        icon={faTrophy}
      />
    )
  if (rank === 3)
    return (
      <FontAwesomeIcon
        className={`${styles.throphy} ${styles.thirdPlaceThrophy}`}
        icon={faTrophy}
      />
    )
  return null
}

interface LeaderboardProps {
  data: Array<{ rank: number; account: string; xp: number }>
  currentUser: { rank: number; account: string; xp: number }
}
const USER_ADDR = '0x4a770E97F7fA83318C8Eda9F9E72874EBB6322ca'

const LeaderboardContainer: React.FC<LeaderboardProps> = () => {
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<
    Array<{ rank: number; account: string; level: number; xp: number; avatar: string }>
  >([])
  const [userLeaderboardData, setCurrentUser] = useState<{
    rank: number
    account: string
    xp: number
    level: number
  } | null>(null)

  const tableRef = useRef<HTMLDivElement>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const currentUserRef = useRef<HTMLDivElement>(null)

  const [stickyPosition, setStickyPosition] = useState<'top' | 'bottom' | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { leaderboard, currentUser } = await getLeaderboard()

        setLeaderboardData(leaderboard)
        currentUser && setCurrentUser(currentUser)
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
        <Podium data={[...sortedData].splice(0, 3)} />
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
              style={{
                position:
                  userLeaderboardData &&
                  item.account === userLeaderboardData.account &&
                  stickyPosition
                    ? 'sticky'
                    : 'relative',
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
                zIndex:
                  userLeaderboardData && item.account === userLeaderboardData.account ? 1000 : 0
              }}
            >
              <div className={styles.cell}>
                {item.rank > 3 ? (
                  <div className={styles.rank}>{item.rank}</div>
                ) : (
                  getBadge(item.rank)
                )}
                <img src="/images/leaderboard/avatar1.png" alt="avatar" className={styles.avatar} />
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
