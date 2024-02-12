import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { SPACING_3XL, SPACING_LG } from '@common/styles/spacings'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import EmailConfirmation from '@web/modules/keystore/components/EmailConfirmation'
import KeyStoreLogo from '@web/modules/keystore/components/KeyStoreLogo'
import Header from '@common/modules/header/components/Header'
import Modal from '@common/components/Modal'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { EmailVaultState } from '@ambire-common/controllers/emailVault/emailVault'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import flexbox from '@common/styles/utils/flexbox'
import { isEmail } from '@ambire-common/services/validations'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import styles from './styles'
import KeystoreResetForm from '../../components/KeyStoreResetForm'

const KeyStoreResetScreen = () => {
  const { t } = useTranslation()

  const {
    watch,
    control,
    formState: { errors, isValid },
    handleSubmit
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      isRecoveryByEmailEnabled: false
    }
  })

  const formEmail = watch('email')

  const { dispatch } = useBackgroundService()
  const [isPasswordChanged, setIsPasswordChanged] = useState(false)
  const keystoreState = useKeystoreControllerState()
  const ev = useEmailVaultControllerState()
  const isWaitingConfirmation = ev.currentState === EmailVaultState.WaitingEmailConfirmation
  const email = useMemo(
    () => Object.keys(ev.emailVaultStates.email)[0],
    [ev.emailVaultStates.email]
  )

  const handleSendResetEmail = useCallback(() => {
    dispatch({ type: 'EMAIL_VAULT_CONTROLLER_RECOVER_KEYSTORE', params: { email: formEmail } })
  }, [formEmail])

  const handleCancelLoginAttempt = useCallback(() => {
    dispatch({
      type: 'EMAIL_VAULT_CONTROLLER_CANCEL_CONFIRMATION'
    })
  }, [dispatch])

  const handleCompleteReset = useCallback(() => {
    handleSubmit(({ password }) => {
      dispatch({
        type: 'KEYSTORE_CONTROLLER_CHANGE_PASSWORD_FROM_RECOVERY',
        params: { newSecret: password }
      })
    })()
  }, [dispatch, handleSubmit])

  useEffect(() => {
    if (
      keystoreState.latestMethodCall === 'changeKeystorePassword' &&
      keystoreState.status === 'SUCCESS'
    ) {
      setIsPasswordChanged(true)
    }
  }, [keystoreState.latestMethodCall, keystoreState.status])

  return (
    <TabLayoutContainer
      width="sm"
      header={
        <Header customTitle={t('Restore Device Password')} withAmbireLogo mode="image-and-title" />
      }
      footer={
        <View style={[flexbox.flex1, flexbox.alignEnd]}>
          <Button
            disabled={!isValid || isWaitingConfirmation}
            onPress={!keystoreState.isUnlocked ? handleSendResetEmail : handleCompleteReset}
            style={styles.button}
            hasBottomSpacing={false}
            text={
              !keystoreState.isUnlocked
                ? t('Send Confirmation Email')
                : t('Change Key Store password')
            }
          />
        </View>
      }
    >
      <TabLayoutWrapperMainContent>
        <>
          <KeyStoreLogo width={120} height={120} style={styles.logo} />
          {!keystoreState.isUnlocked ? (
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
          {!keystoreState.isUnlocked && (
            <View
              style={[
                {
                  marginVertical: SPACING_LG * 2
                }
              ]}
            >
              <Controller
                control={control}
                rules={{
                  validate: isEmail
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('Please insert your email')}
                    onBlur={onBlur}
                    placeholder={t('Email Address')}
                    onChangeText={onChange}
                    onSubmitEditing={handleSendResetEmail}
                    value={value}
                    autoFocus={isWeb}
                    isValid={isEmail(value)}
                    error={!!errors.email && (t('Please fill in a valid email.') as string)}
                  />
                )}
                name="email"
              />
            </View>
          )}
          {keystoreState.isUnlocked && (
            <View
              style={[
                styles.currentEmailContainer,
                {
                  marginBottom: SPACING_LG
                }
              ]}
            >
              <Text style={styles.currentEmailLabel} weight="regular" fontSize={14}>
                {t('The recovery email for current KeyStore is')}{' '}
                <Text style={styles.currentEmailValue} fontSize={14} weight="medium">
                  {email}
                </Text>
              </Text>
            </View>
          )}
          {keystoreState.isUnlocked && (
            <KeystoreResetForm
              control={control}
              errors={errors}
              password={watch('password')}
              isPasswordChanged={isPasswordChanged}
              handleChangeKeystorePassword={handleCompleteReset}
            />
          )}
        </>
        <Modal
          isOpen={ev.currentState === EmailVaultState.WaitingEmailConfirmation}
          modalStyle={{ minWidth: 500, paddingVertical: SPACING_3XL }}
          title={t('Email Confirmation Required')}
        >
          <EmailConfirmation email={email} handleCancelLoginAttempt={handleCancelLoginAttempt} />
        </Modal>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default KeyStoreResetScreen
