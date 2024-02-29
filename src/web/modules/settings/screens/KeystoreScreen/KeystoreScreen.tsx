import React, { useCallback, useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { EmailVaultState } from '@ambire-common/controllers/emailVault/emailVault'
import { isEmail } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

const KeystoreScreen = () => {
  const ev = useEmailVaultControllerState()

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

  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('keystore')
  }, [setCurrentSettingsPage])

  const email = watch('email')

  const handleFormSubmit = useCallback(() => {
    handleSubmit(async () => {
      dispatch({ type: 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET', params: { email } })
    })()
  }, [handleSubmit, dispatch, email])

  return (
    <>
      <View
        style={[
          flexboxStyles.directionRow,
          flexboxStyles.alignCenter,
          flexboxStyles.justifySpaceBetween,
          spacings.mbXl
        ]}
      >
        <Text fontSize={20} weight="medium">
          {t('Device Password Recovery with email')}
        </Text>
      </View>
      <View style={[spacings.mb]}>
        {ev.currentState === EmailVaultState.WaitingEmailConfirmation && (
          <View style={spacings.mbXl}>
            <Text>Waiting email confirmation ...</Text>
          </View>
        )}

        {ev.hasKeystoreRecovery && (
          <View style={spacings.mbXl}>
            <Text>✅ Recovery is enabled!</Text>
          </View>
        )}

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
      </View>
    </>
  )
}

export default React.memo(KeystoreScreen)
