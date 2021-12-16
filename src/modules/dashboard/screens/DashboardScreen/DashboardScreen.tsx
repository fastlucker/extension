import React from 'react'
import { Button, Text, View } from 'react-native'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'

import styles from './styles'

const DashboardScreen = () => {
  const { accounts, onRemoveAccount } = useAccounts()
  const { network } = useNetwork()

  console.log('accounts', accounts)
  console.log('network', network)
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
