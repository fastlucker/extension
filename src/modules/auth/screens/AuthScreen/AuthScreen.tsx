import React from 'react'

import CONFIG, { APP_VERSION, BUILD_NUMBER, RELEASE_CHANNEL, RUNTIME_VERSION } from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import styles from './styles'

interface Props extends NativeStackScreenProps<any, 'auth'> {}

const AuthScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()

  return (
    <Wrapper contentContainerStyle={styles.wrapper}>
      <Title style={textStyles.center}>{t('Ambire Wallet')}</Title>
      <Button
        text={t('Create a new account')}
        onPress={() => navigation.navigate('addNewAccount')}
      />
      <Text style={[textStyles.center, styles.separator]}>{t('– or –')}</Text>

      <Title style={textStyles.center}>{t('Add an account')}</Title>
      <Button text={t('Email login')} onPress={() => navigation.navigate('emailLogin')} />
      <Button text={t('Import from JSON')} onPress={() => navigation.navigate('jsonLogin')} />
      <Button
        text={t('Login by QR code scan')}
        onPress={() => navigation.navigate('qrCodeLogin')}
        style={spacings.mbLg}
      />
      <Text style={[textStyles.center, styles.footer]}>
        app v{APP_VERSION}, build #{BUILD_NUMBER}
        {'\n'}
        {RELEASE_CHANNEL} channel ({RUNTIME_VERSION}), {CONFIG.APP_ENV} env
      </Text>
    </Wrapper>
  )
}

export default AuthScreen
