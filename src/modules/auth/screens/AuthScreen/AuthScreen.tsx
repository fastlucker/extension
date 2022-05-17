import React, { useCallback } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import Button, { Props as ButtonDefaultProps } from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

interface Props extends NativeStackScreenProps<any, 'auth'> {}

interface ButtonProps extends Omit<ButtonDefaultProps, 'onPress'> {
  routeName: string
  onPress: (routeName: string) => void
}

const AuthButton = ({ text, type = 'primary', routeName, onPress }: ButtonProps) => {
  const handleButtonPress = useCallback(() => {
    !!onPress && onPress(routeName)
  }, [])

  return <Button text={text} type={type} onPress={handleButtonPress} />
}

const AuthScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()

  const handleAuthButtonPress = (routeName: string) => {
    navigation.navigate(routeName)
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <AmbireLogo />
        <View style={flexboxStyles.flex1}>
          <AuthButton
            text={t('Login With Email')}
            routeName="emailLogin"
            onPress={handleAuthButtonPress}
            hasBottomSpacing={false}
          />
          <AuthButton
            text={t('Hardware Wallet')}
            routeName="hardwareWallet"
            onPress={handleAuthButtonPress}
            style={spacings.mbLg}
          />
          <Text style={[textStyles.center, spacings.mb]} weight="regular" fontSize={18}>
            {t('– or –')}
          </Text>
          <AuthButton
            text={t('Import From JSON')}
            type="outline"
            routeName="jsonLogin"
            onPress={handleAuthButtonPress}
          />
          <AuthButton
            text={t('Login By QR Code')}
            type="outline"
            routeName="qrCodeLogin"
            onPress={handleAuthButtonPress}
          />
        </View>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default AuthScreen
