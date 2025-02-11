import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const TokenListHeader = () => {
  const { t } = useTranslation()
  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pvMi]}>
      <View style={{ flex: 1.25, ...spacings.plSm }}>
        <Text appearance="secondaryText" fontSize={14}>
          {t('Token')}
        </Text>
      </View>
      <View style={{ flex: 1.5 }}>
        <Text appearance="secondaryText" fontSize={14}>
          {t('Network')}
        </Text>
      </View>
      <View style={{ flex: 0.3, ...spacings.prSm }}>
        <Text appearance="secondaryText" fontSize={14}>
          {t('Visibility')}
        </Text>
      </View>
    </View>
  )
}

export default TokenListHeader
