import React from 'react'
import { View } from 'react-native'

import Placeholder from '@modules/common/components/Placeholder'
import useTransactions from '@modules/transactions/hooks/useTransactions'

import styles from './styles'

const TransactionsScreen = () => {
  const { speedup, cancel, firstPending } = useTransactions()
  return (
    <View style={styles.container}>
      <Placeholder text="Transactions screen" />
    </View>
  )
}

export default TransactionsScreen
