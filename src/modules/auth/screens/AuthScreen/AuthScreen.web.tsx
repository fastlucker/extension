import React, { useCallback } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import Button, { Props as ButtonDefaultProps } from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

interface Props extends NativeStackScreenProps<any, 'auth'> {}

interface ButtonProps extends Omit<ButtonDefaultProps, 'onPress'> {
  routeName: string
  onPress: (routeName: string) => void
}

const AuthButton = ({ text, type = 'primary', routeName, onPress, disabled }: ButtonProps) => {
  const handleButtonPress = useCallback(() => {
    !!onPress && onPress(routeName)
  }, [onPress, routeName])

  return <Button text={text} type={type} disabled={disabled} onPress={handleButtonPress} />
}

const AuthScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()
  const { vaultStatus } = useVault()

  const handleAuthButtonPress = (routeName: string) => {
    if (vaultStatus === VAULT_STATUS.NOT_INITIALIZED) {
      navigation.navigate('createVault', {
        nextRoute: routeName
      })
    } else {
      navigation.navigate(routeName)
    }
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <AmbireLogo />
        <View>
          <AuthButton
            text={t('Login With Email')}
            routeName="ambireAccountLogin"
            onPress={handleAuthButtonPress}
            hasBottomSpacing={false}
          />
          <AuthButton
            text={t('Hardware Wallet (coming soon)')}
            routeName="hardwareWallet"
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
            routeName="ambireAccountJsonLogin"
            onPress={handleAuthButtonPress}
          />
          <AuthButton
            text={t('Login with External Signer')}
            type="outline"
            routeName="externalSigner"
            onPress={handleAuthButtonPress}
          />
        </View>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default AuthScreen
