import React from 'react'
import { StyleSheet, View } from 'react-native'

import Placeholder from '@modules/common/components/Placeholder'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const TransactionsScreen = () => (
  <View style={styles.container}>
    <Placeholder text="Transactions screen" />
  </View>
)

export default TransactionsScreen
