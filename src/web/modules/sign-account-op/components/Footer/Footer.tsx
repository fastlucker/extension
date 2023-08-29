import React from 'react'
import { View } from 'react-native'
import flexbox from '@common/styles/utils/flexbox'
import colors from '@common/styles/colors'
import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import styles from './styles'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Button type="danger" text={t('Reject')} onPress={() => {}} style={styles.rejectButton} />
      <View style={[flexbox.directionRow]}>
        <Button
          type="outline"
          accentColor={colors.violet}
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
