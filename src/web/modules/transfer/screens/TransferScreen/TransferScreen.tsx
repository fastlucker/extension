import React, { useCallback } from 'react'
import { View } from 'react-native'

import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

import AddressBookSection from '../../components/AddressBookSection'
import SendForm from '../../components/SendForm/SendForm'
import useRequestTransaction from '../../hooks/useRequestTransaction'
import styles from './styles'

const TransferScreen = () => {
  const requestTransactionState = useRequestTransaction()
  const { navigate } = useNavigation()

  const onBack = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [navigate])

  return (
    <TabLayoutWrapperMainContent width="mid" forceCanGoBack onBack={onBack}>
      <View style={styles.container}>
        <SendForm requestTransactionState={requestTransactionState} />
        <View style={styles.separator} />
        <AddressBookSection />
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default TransferScreen
