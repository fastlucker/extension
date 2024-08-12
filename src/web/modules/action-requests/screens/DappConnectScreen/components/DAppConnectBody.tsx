import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import getStyles from '../styles'
import DAppPermissions from './DAppPermissions'

const DAppConnectBody = () => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.contentBody}>
      <DAppPermissions />
      <Text
        style={{
          opacity: 0.64,
          marginHorizontal: 'auto'
        }}
        fontSize={14}
        weight="medium"
        appearance="tertiaryText"
      >
        {t('Only connect with sites you trust')}
      </Text>
    </View>
  )
}

export default DAppConnectBody
