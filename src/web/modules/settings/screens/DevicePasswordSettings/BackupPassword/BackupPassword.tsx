import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmailVaultState } from '@ambire-common/controllers/emailVault/emailVault'
import { isEmail } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import Text from '@common/components/Text'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import spacings, { SPACING_3XL, SPACING_XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { View } from 'react-native'
import Alert from '@common/components/Alert'
import EmailConfirmation from '@web/modules/keystore/components/EmailConfirmation'
import Modal from '@common/components/Modal'

const BackupPassword = () => {
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
      email: Object.keys(ev.emailVaultStates.email)[0] || '' // it should be string, otherwise it will cause a crash
    }
  })

  console.log({ ev, keystoreState })

  const email = watch('email')

  const handleFormSubmit = useCallback(() => {
    handleSubmit(async () => {
      dispatch({ type: 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET', params: { email } })
    })()
  }, [handleSubmit, dispatch, email])

  const handleCancelLoginAttempt = useCallback(() => {
    dispatch({
      type: 'EMAIL_VAULT_CONTROLLER_CANCEL_CONFIRMATION'
    })
  }, [dispatch])

  return (
    <>
      <View style={flexbox.flex1}>
        <Text weight="medium" fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]}>
          {t('Device Password Recovery with email')}
        </Text>

        {ev.hasKeystoreRecovery && (
          <Alert
            type="success"
            title={t('Email recovery enabled!')}
            size="sm"
            style={{ ...spacings.mbTy }}
            isTypeLabelHidden
          />
        )}
        <Controller
          control={control}
          rules={{
            validate: isEmail
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              placeholder={t('E-mail')}
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
          style={{ alignSelf: 'flex-start', paddingHorizontal: SPACING_XL }}
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
              : ev.hasKeystoreRecovery
              ? t('Enabled')
              : t('Enable')
          }
          onPress={handleFormSubmit}
        />
        <Alert
          type="info"
          isTypeLabelHidden
          style={spacings.mtXl}
          title={
            <Text appearance="infoText" weight="semiBold">
              {t('How it works')}
            </Text>
          }
          text={t(
            'Email-based keystore recovery is locally enabled, and it does not upload any keys.'
          )}
        />
      </View>
      <Modal
        isOpen={
          ev.currentState === EmailVaultState.WaitingEmailConfirmation ||
          ev.currentState === EmailVaultState.UploadingSecret
        }
        modalStyle={{ minWidth: 500, paddingVertical: SPACING_3XL }}
        title={t('Email Confirmation Required')}
      >
        <EmailConfirmation email={email} handleCancelLoginAttempt={handleCancelLoginAttempt} />
      </Modal>
    </>
  )
}

export default BackupPassword
