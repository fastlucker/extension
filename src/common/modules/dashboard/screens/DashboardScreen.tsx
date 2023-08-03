import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'

const DashboardScreen = () => {
  const { t } = useTranslation()

  return (
    <View>
      <View>
        <Text>{t('Balance')}</Text>
        <Text>{t('$ 20,500.90')}</Text>
      </View>
      <View />
    </View>
  )
}

export default DashboardScreen
