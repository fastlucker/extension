import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import Spinner from '@common/components/Spinner'
import { fetchCaught } from '@common/services/fetch'

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
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
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
    (loading && <Spinner />) || (
      <ScrollView style={styles.container}>
        <Text style={[styles.title]}>Leaderboard</Text>
        <View>
          {sortedData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.row,
                item.rank <= 3 && styles.highlightRow,
                item.account === userLeaderboardData.account && styles.currentUserRow
              ]}
            >
              <Text style={styles.cell}>
                {item.rank} {getBadge(item.rank)}
              </Text>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.cell}>{shortenAddress(item.account)}</Text>
              <Text style={styles.cell}>{item.level}</Text>
              <Text style={styles.cell}>{item.xp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    )
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  highlightRow: {
    backgroundColor: '#f0f8ff'
  },
  currentUserRow: {
    backgroundColor: '#e0ffe0', // Light green background for current user
    borderColor: '#00ff00', // Green border for current user
    borderWidth: 2
  },
  cell: {
    flex: 1,
    textAlign: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
})

export default LeaderboardContainer
