import React from 'react'
import { Button, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'

const Balances = () => {
  const { t } = useTranslation()
  const { balance, isBalanceLoading } = usePortfolio()

  if (isBalanceLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text>{t('Balance')}</Text>
      <Text>$ {balance.total?.truncated}</Text>
      <Text>.{balance.total?.decimals}</Text>
    </View>
  )
}

export default Balances
