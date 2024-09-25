import React, { useEffect, useState } from 'react'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import { fetchCaught } from '@common/services/fetch'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Leaderboard.module.scss'

const getLeaderboard = async (currentUser?: string) => {
  try {
    const res = await fetchCaught(
      `https://staging-relayer.ambire.com/legends/leaderboard${
        currentUser && `?identity=${currentUser}`
      }`
    )
    return res.body
  } catch {
    console.error('Error fetching leaderboard')
    return { leaderboard: [], currentUser: { rank: 0, avatar: '', account: '', xp: 0 } }
  }
}

const getBadge = (rank: number) => {
  if (rank === 1)
    return (
      <FontAwesomeIcon className={(styles.throphy, styles.firstPlaceThrophy)} icon={faTrophy} />
    )
  if (rank === 2)
    return (
      <FontAwesomeIcon className={(styles.throphy, styles.secondPlaceThrophy)} icon={faTrophy} />
    )
  if (rank === 3)
    return (
      <FontAwesomeIcon className={(styles.throphy, styles.thirdPlaceThrophy)} icon={faTrophy} />
    )
  return null
}

interface LeaderboardProps {
  data: Array<{ rank: number; account: string; xp: number; avatar: string }>
  currentUser: { rank: number; account: string; xp: number; avatar: string }
}
const USER_ADDR = '0x676E327EC5f53aA22906363Ef741a9f8894E0ad1'

const LeaderboardContainer: React.FC<LeaderboardProps> = () => {
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [userLeaderboardData, setCurrentUser] = useState({
    rank: 0,
    avatar: '',
    account: '',
    xp: 0
  })

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { leaderboard, currentUser } = await getLeaderboard(USER_ADDR)
        setLeaderboardData(leaderboard.slice(0, 100))
        setCurrentUser(currentUser)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const sortedData = [
    ...leaderboardData,
    (!leaderboardData.find((user) => user.account === userLeaderboardData.account) &&
      userLeaderboardData) ||
      []
  ]
    .flat()
    .sort((a, b) => b.xp - a.xp)

  return (
    (loading && <div>Loading...</div>) || (
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id nisl fringilla,
            aliquet elit sit amet, feugiat nisi. Vestibulum condimentum aliquet tortor, eu laoreet
            magna luctus et.
          </p>
        </div>
        <div className={styles.podium}>
          <div className={(styles.step, styles.second)}>
            <div className={styles.name}>goshokazana.x</div>
            <div className={styles.position}>18 349</div>
          </div>
          <div className={(styles.step, styles.first)}>
            <img alt="avatar" className={styles.avatar} />
            <div className={styles.name}>elmoto.eth</div>
            <div className={styles.position}>19 349</div>
          </div>
          <div className={(styles.step, styles.third)}>
            <div className={styles.name}>0x66fE...04d08</div>
            <div className={styles.position}>18 349</div>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.header}>
            <h5 className={styles.cell}>player</h5>
            <h5 className={styles.cell}>Level</h5>
            <h5 className={styles.cell}>XP</h5>
          </div>
          {sortedData.map((item, index) => (
            <div key={index} className={styles.row}>
              <h5 className={styles.cell}>{item.rank > 3 ? item.rank : getBadge(item.rank)}</h5>
              <img src="/images/leaderboard/avatar1.png" alt="avatar" className={styles.avatar} />
              <h5 className={styles.cell}>{shortenAddress(item.account)}</h5>
              <h5 className={styles.cell}>{item.level}</h5>
              <h5 className={styles.cell}>{item.xp}</h5>
            </div>
          ))}
        </div>
      </div>
    )
  )
}

export default LeaderboardContainer
