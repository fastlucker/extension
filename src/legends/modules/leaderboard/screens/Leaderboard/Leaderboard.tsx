import React, { useLayoutEffect, useRef, useState } from 'react'

import Alert from '@legends/components/Alert'
import Page from '@legends/components/Page'
import Spinner from '@legends/components/Spinner'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'

import Podium from './components/Podium'
import Row from './components/Row'
import styles from './Leaderboard.module.scss'

const LeaderboardContainer: React.FC = () => {
  const {
    leaderboardData,
    userLeaderboardData,
    isLeaderboardLoading: loading,
    error
  } = useLeaderboardContext()

  const tableRef = useRef<HTMLDivElement>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const currentUserRef = useRef<HTMLDivElement>(null)

  const [stickyPosition, setStickyPosition] = useState<'top' | 'bottom' | null>(null)

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
  }, [currentUserRef, leaderboardData, userLeaderboardData])

  return (
    <Page pageRef={pageRef}>
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>
            This is where your earned XP showcases your legacy in the world of Web3. Compete, rise
            through the ranks, and leave your mark among the top Legends!
          </p>
        </div>
        {loading && <Spinner />}
        {error && <Alert type="error" title={error} />}
        {leaderboardData && leaderboardData.length ? (
          <>
            <Podium data={leaderboardData.slice(0, 3)} />
            <div ref={tableRef} className={styles.table}>
              <div className={styles.header}>
                <div className={styles.cell}>
                  <h5>#</h5>
                  <h5 className={styles.playerCell}>player</h5>
                </div>
                <h5 className={styles.cell}>Level</h5>
                <h5 className={styles.cell}>XP</h5>
              </div>
              {leaderboardData.map((item) => (
                <Row
                  key={item.account}
                  {...item}
                  stickyPosition={stickyPosition}
                  currentUserRef={currentUserRef}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </Page>
  )
}

export default LeaderboardContainer
