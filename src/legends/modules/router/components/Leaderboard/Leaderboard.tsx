import React, { useEffect, useState } from 'react'

import Spinner from '@common/components/Spinner'
import { fetchCaught } from '@common/services/fetch'

const getLeaderboard = async (skip?: number, limit?: number) => {
  try {
    const res = await fetchCaught('https://staging-relayer.ambire.com/legends/leaderboard')
    return res.body
  } catch {
    console.error('Error fetching leaderboard')
  }
}

const getBadge = (rank: number) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

const currentUser = {
  rank: 0,
  avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
  account: '0x1819...yzab',
  ens: 'currentuser.eth',
  xp: 47500
}

interface LeaderboardProps {
  data: Array<{ rank: number; account: string; xp: number; avatar: string }>
  currentUser: { rank: number; account: string; xp: number; avatar: string }
}

const LeaderboardContainer: React.FC<LeaderboardProps> = () => {
  const [sortBy, setSortBy] = useState<'xp' | 'earnings'>('xp')
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { leaderboard } = await getLeaderboard()
        setLeaderboardData(leaderboard)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const combinedData = [...(leaderboardData || []), currentUser]

  const sortedData = combinedData.sort((a, b) => b.xp - a.xp)

  let currentRank = 1
  sortedData.forEach((item, index) => {
    if (index > 0 && item.xp === sortedData[index - 1].xp) {
      item.rank = sortedData[index - 1].rank
    } else {
      item.rank = currentRank
    }
    currentRank++
  })

  return (
    (loading && <Spinner />) || (
      <div style={styles.container}>
        <h1 style={styles.title}>Leaderboard</h1>
        <div style={styles.sortContainer}>
          <span>Sort by: </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'xp' | 'earnings')}
            style={styles.picker}
          >
            <option value="xp">XP</option>
            <option value="earnings">Earnings</option>
          </select>
        </div>
        <div>
          {sortedData.slice(0, 100).map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.row,
                ...(item.rank <= 3 ? styles.highlightRow : {}),
                ...(item.account === currentUser.account ? styles.currentUserRow : {})
              }}
            >
              <span style={styles.cell}>
                {item.rank} {getBadge(item.rank)}
              </span>
              <img src={item.avatar} alt="avatar" style={styles.avatar} />
              <span style={styles.cell}>{item.account}</span>
              <span style={styles.cell}>{item.xp}</span>
            </div>
          ))}
        </div>
      </div>
    )
  )
}

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  },
  picker: {
    height: '30px',
    marginLeft: '8px'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #ccc'
  },
  highlightRow: {
    backgroundColor: '#f0f8ff'
  },
  currentUserRow: {
    backgroundColor: '#e0ffe0', // Light green background for current user
    borderColor: '#00ff00', // Green border for current user
    borderWidth: '2px'
  },
  cell: {
    flex: 1,
    textAlign: 'center'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '15px'
  }
}

export default LeaderboardContainer
