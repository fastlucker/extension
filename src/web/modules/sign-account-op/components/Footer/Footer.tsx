import React from 'react'
import { View } from 'react-native'

import CartIcon from '@common/assets/svg/CartIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

import getStyles from './styles'

type Props = {
  onReject: () => void
  onAddToCart: () => void
  onSign: () => void
  isSignLoading: boolean
  readyToSign: boolean
  isViewOnly: boolean
  isEOA: boolean
}

const Footer = ({
  onReject,
  onAddToCart,
  onSign,
  isSignLoading,
  readyToSign,
  isViewOnly,
  isEOA
}: Props) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <Button
        type="danger"
        text={t('Reject')}
        onPress={onReject}
        hasBottomSpacing={false}
        size="large"
      >
        <View style={spacings.plSm}>
          <CloseIcon color={theme.errorDecorative} />
        </View>
      </Button>
      {!!isViewOnly && (
        <Text appearance="errorText" weight="medium" style={[text.center, spacings.ph]}>
          {t("You can't sign transactions with view-only accounts.")}
        </Text>
      )}
      <View style={[flexbox.directionRow]}>
        {!isEOA && (
          <Button
            type="outline"
            accentColor={theme.primary}
            text={t('Queue and Sign Later')}
            onPress={onAddToCart}
            disabled={isSignLoading || isViewOnly}
            hasBottomSpacing={false}
            style={spacings.mr}
            size="large"
          >
            <View style={spacings.plSm}>
              <CartIcon color={theme.primary} />
            </View>
          </Button>
        )}
        <Button
          type="primary"
          disabled={isSignLoading || isViewOnly || !readyToSign}
          text={isSignLoading ? t('Signing...') : t('Sign')}
          onPress={onSign}
          hasBottomSpacing={false}
          size="large"
        />
      </View>
    </View>
  )
}

export default Footer
