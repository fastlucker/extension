import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  onReject: () => void
  onAddToCart: () => void
  onSign: () => void
}

const Footer = ({ onReject, onAddToCart, onSign }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Button type="danger" text={t('Reject')} onPress={onReject} style={styles.rejectButton} />
      <View style={[flexbox.directionRow]}>
        <Button
          type="outline"
          accentColor={colors.violet}
          text={t('Add to Cart')}
          onPress={onAddToCart}
          style={styles.addMoreTxnButton}
        />
        <Button type="primary" text={t('Sign')} onPress={onSign} style={styles.signButton} />
      </View>
    </View>
  )
}

export default Footer
