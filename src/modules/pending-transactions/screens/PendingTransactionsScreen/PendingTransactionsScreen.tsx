import React, { useEffect } from 'react'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useRequests from '@modules/common/hooks/useRequests'

const PendingTransactionsScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const { setSendTxnState } = useRequests()

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        setSendTxnState({ showing: false })
      }),
    [navigation]
  )

  return (
    <Wrapper>
      <Text>Pending Transactions</Text>
    </Wrapper>
  )
}

export default PendingTransactionsScreen
