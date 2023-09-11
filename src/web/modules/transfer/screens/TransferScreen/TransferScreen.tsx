import React, { useCallback } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useMainControllerState from '@web/hooks/useMainControllerState'

import AddressBookSection from '../../components/AddressBookSection'
import SendForm from '../../components/SendForm/SendForm'
import useRequestTransaction from '../../hooks/useRequestTransaction'

const TransferScreen = () => {
  const requestTransactionState = useRequestTransaction()
  const { userRequests } = useMainControllerState()
  const { navigate } = useNavigation()

  const onBack = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [navigate])

  return (
    <TabLayoutWrapperMainContent width="mid" forceCanGoBack onBack={onBack}>
      <View style={[flexbox.directionRow, spacings.pv]}>
        <SendForm requestTransactionState={requestTransactionState} />
        <View
          style={{ width: 1, height: '100%', backgroundColor: '#6770B333', marginHorizontal: 30 }}
        />
        <AddressBookSection />
      </View>
      {/* Display the requests temporary */}
      <Text fontSize={14}>
        {JSON.stringify(
          userRequests,
          (key, value) => {
            return typeof value === 'bigint' ? { $bigint: value.toString() } : value
          },
          4
        )}
      </Text>
    </TabLayoutWrapperMainContent>
  )
}

export default TransferScreen
