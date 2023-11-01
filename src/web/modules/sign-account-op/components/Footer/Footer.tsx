import React from 'react'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import CartIcon from '@common/assets/svg/CartIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import SigningKeySelect from '@web/modules/sign-message/components'

import getStyles from './styles'

type Props = {
  onReject: () => void
  onAddToCart: () => void
  onSign: () => void
  isSignLoading: boolean
  isChooseSignerShown: boolean
  handleChangeSigningKey: (signingKeyAddr: string, signingKeyType: string) => void
  selectedAccountKeyStoreKeys: Key[]
}

const Footer = ({
  onReject,
  onAddToCart,
  onSign,
  isSignLoading,
  isChooseSignerShown,
  handleChangeSigningKey,
  selectedAccountKeyStoreKeys
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
        style={spacings.phLg}
      >
        <View style={spacings.plSm}>
          <CloseIcon color={theme.errorDecorative} withRect={false} width={24} height={24} />
        </View>
      </Button>
      <View style={[flexbox.directionRow]}>
        <Button
          type="outline"
          accentColor={theme.primary}
          text={t('Add to Cart')}
          onPress={onAddToCart}
          hasBottomSpacing={false}
          style={[spacings.phLg, spacings.mr]}
        >
          <View style={spacings.plSm}>
            <CartIcon color={theme.primary} />
          </View>
        </Button>
        <View style={styles.signButtonContainer}>
          {isChooseSignerShown ? (
            <SigningKeySelect
              selectedAccountKeyStoreKeys={selectedAccountKeyStoreKeys}
              handleChangeSigningKey={handleChangeSigningKey}
            />
          ) : null}
          <Button
            type="primary"
            disabled={isSignLoading}
            text={isSignLoading ? t('Signing...') : t('Sign')}
            onPress={onSign}
            hasBottomSpacing={false}
            style={spacings.phLg}
          />
        </View>
      </View>
    </View>
  )
}

export default Footer
