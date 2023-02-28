import React, { useCallback } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import { ROUTES } from '@config/Router/routesConfig'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import Button, { Props as ButtonDefaultProps } from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useNavigation from '@modules/common/hooks/useNavigation'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface ButtonProps extends Omit<ButtonDefaultProps, 'onPress'> {
  routeName: ROUTES
  onPress: (nextRoute: ROUTES) => void
}

const AuthButton = React.memo(
  ({ text, type = 'primary', routeName, onPress, disabled }: ButtonProps) => {
    const handleButtonPress = useCallback(() => {
      !!onPress && onPress(routeName)
    }, [onPress, routeName])

    return <Button text={text} type={type} disabled={disabled} onPress={handleButtonPress} />
  }
)

const AuthScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const handleAuthButtonPress = useCallback((nextRoute: ROUTES) => navigate(nextRoute), [navigate])

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <AmbireLogo />
        <View>
          <AuthButton
            text={t('Login With Email')}
            routeName={ROUTES.ambireAccountLogin}
            onPress={handleAuthButtonPress}
            hasBottomSpacing={false}
          />
          <AuthButton
            text={t('Hardware Wallet (coming soon)')}
            routeName={ROUTES.hardwareWallet}
            onPress={handleAuthButtonPress}
            disabled // temporary disabled until we have this feature
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
