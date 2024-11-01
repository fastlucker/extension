import React from 'react'
import { View } from 'react-native'

import CartIcon from '@common/assets/svg/CartIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import ActionsPagination from '@web/modules/action-requests/components/ActionsPagination'

import getStyles from './styles'

type Props = {
  onReject: () => void
  onAddToCart: () => void
  onSign: () => void
  isSignLoading: boolean
  isSignDisabled: boolean
  isAddToCartDisplayed: boolean
  isAddToCartDisabled: boolean
  inProgressButtonText: string
}

const Footer = ({
  onReject,
  onAddToCart,
  onSign,
  isSignLoading,
  isSignDisabled,
  isAddToCartDisplayed,
  isAddToCartDisabled,
  inProgressButtonText
}: Props) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <View style={[!isAddToCartDisplayed && flexbox.flex1, flexbox.alignStart]}>
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
      </View>
      <ActionsPagination />
      <View
        style={[flexbox.directionRow, !isAddToCartDisplayed && flexbox.flex1, flexbox.justifyEnd]}
      >
        {isAddToCartDisplayed && (
          <Button
            testID="queue-and-sign-later-button"
            type="outline"
            accentColor={theme.primary}
            text={t('Queue and Sign Later')}
            onPress={onAddToCart}
            disabled={isAddToCartDisabled}
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
          testID="transaction-button-sign"
          type="primary"
          disabled={isSignDisabled}
          text={isSignLoading ? inProgressButtonText : t('Sign')}
          onPress={onSign}
          hasBottomSpacing={false}
          size="large"
        />
      </View>
    </View>
  )
}

export default Footer
