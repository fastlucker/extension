import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'

import styles from './styles'

interface Props {
  balance: string
}

const GasTankBalance = ({ balance }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text>{t('Gas Tank Balance')}</Text>
      <Text>{`$${balance}`}</Text>
    </View>
  )
}

export default GasTankBalance
