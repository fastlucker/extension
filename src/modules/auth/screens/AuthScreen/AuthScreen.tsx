import React from 'react'
import { Image, View } from 'react-native'

import logo from '@assets/images/Ambire-Wallet-logo-colored-white-vertical.png'
import { useTranslation } from '@config/localization'
import AppVersion from '@modules/common/components/AppVersion'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import styles from './styles'

interface Props extends NativeStackScreenProps<any, 'auth'> {}

const AuthScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <View style={styles.logoWrapper}>
          <Image source={logo} />
        </View>
        <Button
          text={t('Create New Account')}
          onPress={() => navigation.navigate('addNewAccount')}
          hasBottomSpacing={false}
        />
        <Text style={[textStyles.center, spacings.pvLg]} fontSize={18}>
          {t('– or –')}
        </Text>
        <Button
          text={t('Login With Email')}
          type="outline"
          onPress={() => navigation.navigate('emailLogin')}
        />
        <Button
          text={t('Import From JSON')}
          type="outline"
          onPress={() => navigation.navigate('jsonLogin')}
        />
        <Button
          text={t('Login By QR Code')}
          type="outline"
          onPress={() => navigation.navigate('qrCodeLogin')}
        />
        <Button
          text={t('Hardware Wallet')}
          type="outline"
          onPress={() => navigation.navigate('hardwareWallet')}
          style={spacings.mbLg}
        />
        <AppVersion />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default AuthScreen
