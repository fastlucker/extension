import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { SPACING_LG } from '@common/styles/spacings'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import EmailConfirmation from '@web/modules/keystore/components/EmailConfirmation'
import KeyStoreLogo from '@web/modules/keystore/components/KeyStoreLogo'

import BackButton from '@common/components/BackButton'
import Header from '@common/modules/header/components/Header'
import Modal from '@common/components/Modal'
import KeystoreResetForm from '../../components/KeyStoreResetForm'
import styles from './styles'

const KeyStoreResetScreen = () => {
  const { t } = useTranslation()
  const [keyStoreResetStep, setKeyStoreResetStep] = useState<
    'initial' | 'confirming' | 'confirmed'
  >('initial')
  const [timeoutToBeCleared, setTimeoutToBeCleared] = useState<any>(null)
  const isInitial = keyStoreResetStep === 'initial'
  const isConfirming = keyStoreResetStep === 'confirming'
  const {
    watch,
    control,
    formState: { errors, isValid },
    handleSubmit
  } = useForm({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: '',
      isRecoveryByEmailEnabled: false
    }
  })

  const handleSendResetEmail = useCallback(() => {
    setKeyStoreResetStep('confirming')

    const timeout = setTimeout(() => {
      setKeyStoreResetStep('confirmed')
    }, 5000)

    setTimeoutToBeCleared(timeout)
  }, [setKeyStoreResetStep])

  const handleCancelLoginAttempt = useCallback(() => {
    clearTimeout(timeoutToBeCleared)
    setKeyStoreResetStep('initial')
  }, [timeoutToBeCleared])

  const handleCompleteReset = useCallback(() => {
    handleSubmit(({ password, confirmPassword, isRecoveryByEmailEnabled }) => {
      console.log(password, confirmPassword, isRecoveryByEmailEnabled)
    })()
  }, [handleSubmit])

  return (
    <TabLayoutContainer
      width="sm"
      header={
        <Header customTitle={t('Restore Device Password. Under development!')} withAmbireLogo mode="image-and-title" />
      }
      footer={
        <>
          <BackButton />
          <View>
            <Button
              disabled={!isValid && !isInitial}
              onPress={isInitial ? handleSendResetEmail : handleCompleteReset}
              style={styles.button}
              hasBottomSpacing={false}
              text={isInitial ? t('Send Confirmation Email') : t('Setup Ambire Key Store')}
            />
          </View>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <>
          <KeyStoreLogo width={120} height={120} style={styles.logo} />
          {isInitial ? (
            <Text style={styles.text} weight="regular" fontSize={14}>
              At Ambire Wallet, we take your security seriously. To ensure that your Passphrase
              remains private, we do not keep a copy of it. Your KeyStore recovery is activated by
              email. To change your Passphrase, simply click on the &apos;recover by email&apos;
              option and enter the one-time code that you receive. Then, fill out the password and
              confirm password fields to reset your Passphrase. This ensures that only you have
              access to your wallet. Thanks for trusting Ambire Wallet with your crypto!
            </Text>
          ) : (
            <>
              <Text style={styles.text} weight="regular" fontSize={14}>
                {t('Your email is confirmed')}.
              </Text>
              <Text style={styles.text} weight="regular" fontSize={14}>
                {t(
                  'To finish the KeyStore recovery procedure, simply add your new password when prompted'
                )}
                .
              </Text>
            </>
          )}
          <View
            style={[
              styles.currentEmailContainer,
              {
                marginBottom: isInitial ? SPACING_LG * 2 : SPACING_LG
              }
            ]}
          >
            <Text style={styles.currentEmailLabel} weight="regular" fontSize={14}>
              {t('The recovery email for current KeyStore is')}{' '}
              <Text style={styles.currentEmailValue} fontSize={14} weight="medium">
                demo@ambire.com
              </Text>
            </Text>
          </View>
          {!isInitial && (
            <KeystoreResetForm control={control} errors={errors} password={watch('password')} />
          )}
        </>
        <Modal isOpen={isConfirming} modalStyle={{ minWidth: 'unset' }}>
          <EmailConfirmation handleCancelLoginAttempt={handleCancelLoginAttempt} />
        </Modal>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default KeyStoreResetScreen
