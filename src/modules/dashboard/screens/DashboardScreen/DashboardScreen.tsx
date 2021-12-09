import React from 'react'
import { StyleSheet, View } from 'react-native'

import Placeholder from '@modules/common/components/Placeholder'
import useAccounts from '@modules/common/hooks/useAccounts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const DashboardScreen = () => {
  const { accounts } = useAccounts()

  console.log(accounts)
  return (
    <View style={styles.container}>
      <Placeholder text="Dashboard screen" />
    </View>
  )
}

export default DashboardScreen
