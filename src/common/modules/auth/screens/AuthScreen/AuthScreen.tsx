import React, { useCallback } from 'react'
import { View } from 'react-native'

import Button, { Props as ButtonDefaultProps } from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import AmbireLogo from '@common/modules/auth/components/AmbireLogo'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

interface ButtonProps extends Omit<ButtonDefaultProps, 'onPress'> {
  routeName: ROUTES
  onPress: (nextRoute: ROUTES) => void
}

const AuthButton = React.memo(({ text, type = 'primary', routeName, onPress }: ButtonProps) => {
  const handleButtonPress = useCallback(() => {
    !!onPress && onPress(routeName)
  }, [onPress, routeName])

  return <Button text={text} type={type} onPress={handleButtonPress} />
})

const AuthScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const handleAuthButtonPress = useCallback((nextRoute: ROUTES) => navigate(nextRoute), [navigate])

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <AmbireLogo />
        <View style={flexboxStyles.flex1}>
          <AuthButton
            text={t('Login With Email')}
            routeName={ROUTES.ambireAccountLogin}
            onPress={handleAuthButtonPress}
            hasBottomSpacing={false}
          />
          <AuthButton
            text={t('Hardware Wallet')}
            routeName={ROUTES.hardwareWallet}
            onPress={handleAuthButtonPress}
            style={spacings.mbLg}
          />
          <Text style={[textStyles.center, spacings.mb]} weight="regular" fontSize={18}>
            {t('– or –')}
          </Text>
          <AuthButton
            text={t('Import From JSON')}
            type="outline"
            routeName={ROUTES.ambireAccountJsonLogin}
            onPress={handleAuthButtonPress}
          />
          <AuthButton
            text={t('Login By QR Code')}
            type="outline"
            routeName={ROUTES.qrCodeLogin}
            onPress={handleAuthButtonPress}
          />
          <AuthButton
            text={t('Login with External Signer')}
            type="outline"
            routeName={ROUTES.externalSigner}
            onPress={handleAuthButtonPress}
          />
        </View>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default React.memo(AuthScreen)
