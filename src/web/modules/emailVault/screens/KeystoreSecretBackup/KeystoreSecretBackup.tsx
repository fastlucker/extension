import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmailVaultState } from '@ambire-common/controllers/emailVault/emailVault'
import { isEmail } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import Text from '@common/components/Text'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const KeystoreSecretBackup = () => {
  const ev = useEmailVaultControllerState()
  const keystoreState = useKeystoreControllerState()
  const { t } = useTranslation()

  const { dispatch } = useBackgroundService()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    }
  })

  console.log({ ev, keystoreState })

  const email = watch('email')

  const handleFormSubmit = useCallback(() => {
    handleSubmit(async () => {
      dispatch({ type: 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET', params: { email } })
    })()
  }, [handleSubmit, dispatch, email])

  return (
    <TabLayoutWrapperMainContent>
      {ev.currentState === EmailVaultState.WaitingEmailConfirmation && (
        <Text>Waiting email confirmation!</Text>
      )}

      {ev.hasKeystoreRecovery && <Text>✅ Email vault is set!</Text>}
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
            onSubmitEditing={handleFormSubmit}
            value={value}
            autoFocus={isWeb}
            isValid={isEmail(value)}
            error={!!errors.email && (t('Please fill in a valid email.') as string)}
            disabled={ev.hasKeystoreRecovery}
          />
        )}
        name="email"
      />
      <Button
        textStyle={{ fontSize: 14 }}
        disabled={
          ev.currentState === EmailVaultState.Loading ||
          isSubmitting ||
          !email ||
          ev.hasKeystoreRecovery
        }
        type="primary"
        text={
          // eslint-disable-next-line no-nested-ternary
          isSubmitting || ev.currentState === EmailVaultState.Loading
            ? t('Loading...')
            : t('Enable')
        }
        onPress={handleFormSubmit}
      />
    </TabLayoutWrapperMainContent>
  )
}

export default KeystoreSecretBackup
