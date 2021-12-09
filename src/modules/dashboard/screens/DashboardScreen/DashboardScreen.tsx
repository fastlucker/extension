import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import useAccounts from '@modules/common/hooks/useAccounts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  accItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const DashboardScreen = () => {
  const { accounts, onRemoveAccount } = useAccounts()

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Accounts</Text>
      {accounts.map((account: any) => (
        <View style={styles.accItemStyle} key={account?.id}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1}>{account?.baseIdentityAddr}</Text>
          </View>
          <Button onPress={() => onRemoveAccount(account?.id)} title="Remove" />
        </View>
      ))}
    </View>
  )
}

export default DashboardScreen
