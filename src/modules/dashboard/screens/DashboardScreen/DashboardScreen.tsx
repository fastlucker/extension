import React from 'react'
import { Button, View } from 'react-native'

import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import Assets from '@modules/dashboard/components/Assets'
import Balances from '@modules/dashboard/components/Balances'

import styles from './styles'

const DashboardScreen = () => {
  const { accounts, onRemoveAccount } = useAccounts()
  const { network, setNetwork } = useNetwork()

  return (
    <Wrapper>
      <Balances />

      <Assets />

      <Title>Accounts</Title>
      {accounts.map((account: any) => (
        <View style={styles.accItemStyle} key={account?.id}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1}>{account?.id}</Text>
          </View>
          <Button onPress={() => onRemoveAccount(account?.id)} title="Remove" />
        </View>
      ))}

      <View style={styles.balanceContainer}>
        <Text>{`Selected Network: ${network?.name}`}</Text>
        <Button onPress={() => setNetwork(137)} title="Switch to Polygon network" />
        <Button onPress={() => setNetwork(1)} title="Switch to Ethereum network" />
      </View>
    </Wrapper>
  )
}

export default DashboardScreen
