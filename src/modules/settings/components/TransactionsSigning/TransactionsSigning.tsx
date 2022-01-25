import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import usePasscode from '@modules/common/hooks/usePasscode'
import { useNavigation } from '@react-navigation/native'

const TransactionsSigning = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { isLoading } = usePasscode()

  if (isLoading) return null

  return (
    <Button
      text={t('Transactions signing')}
      onPress={() => navigation.navigate('transactions-signing')}
    />
  )
}

export default TransactionsSigning
