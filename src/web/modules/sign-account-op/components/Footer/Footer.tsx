import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

const Footer = () => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <Button type="danger" text={t('Reject')} onPress={() => {}} style={styles.rejectButton} />
      <View style={[flexbox.directionRow]}>
        <Button
          type="outline"
          accentColor={theme.primary}
          text={t('Add More Transactions')}
          onPress={() => {}}
          style={styles.addMoreTxnButton}
        />
        <Button type="primary" text={t('Sign')} onPress={() => {}} style={styles.signButton} />
      </View>
    </View>
  )
}

export default Footer
