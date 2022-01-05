import React from 'react'
import { Button, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import textStyles from '@modules/common/styles/utils/text'

const Balances = () => {
  const { t } = useTranslation()
  const { balance, isBalanceLoading } = usePortfolio()

  if (isBalanceLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text>{t('Balance')}</Text>
      <Text>
        <Text style={textStyles.highlightPrimary}>$</Text> {balance.total?.truncated}{' '}
        <Text style={textStyles.highlightPrimary}>.{balance.total?.decimals}</Text>
      </Text>
    </View>
  )
}

export default Balances
