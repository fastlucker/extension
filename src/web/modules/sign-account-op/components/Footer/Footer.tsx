import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type Props = {
  onReject: () => void
  onAddToCart: () => void
  onSign: () => void
  isSignLoading: boolean
}

const Footer = ({ onReject, onAddToCart, onSign, isSignLoading }: Props) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <Button type="danger" text={t('Reject')} onPress={onReject} style={styles.rejectButton} />
      <View style={[flexbox.directionRow]}>
        <Button
          type="outline"
          accentColor={theme.primary}
          text={t('Add to Cart')}
          onPress={onAddToCart}
          style={styles.addMoreTxnButton}
        />
        <Button
          type="primary"
          disabled={isSignLoading}
          text={isSignLoading ? t('Signing...') : t('Sign')}
          onPress={onSign}
          style={styles.signButton}
        />
      </View>
    </View>
  )
}

export default Footer
