import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

interface Props {
  onPasswordConfirmed: () => void
}

const PasswordConfirmation: React.FC<Props> = ({ onPasswordConfirmed }) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const keystoreState = useKeystoreControllerState()
  const { theme } = useTheme()

  const { navigate } = useNavigation()

  // this shouldn't happen
  // if the user doesn't have a keystore password set, navigate him to set it
  useEffect(() => {
    if (!keystoreState.hasPasswordSecret) navigate(WEB_ROUTES.devicePasswordSet)
  }, [keystoreState.hasPasswordSecret, navigate])

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      password: ''
    }
  })

  useEffect(() => {
    if (keystoreState.errorMessage) setError('password', { message: keystoreState.errorMessage })
    else if (keystoreState.statuses.unlockWithSecret === 'SUCCESS') {
      onPasswordConfirmed()
    }
  }, [
    keystoreState.errorMessage,
    keystoreState.statuses.unlockWithSecret,
    setError,
    dispatch,
    onPasswordConfirmed
  ])

  const handleUnlock = useCallback(
    (data: { password: string }) => {
      dispatch({
        type: 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET',
        params: { secretId: 'password', secret: data.password }
      })
    },
    [dispatch]
  )

  const passwordFieldValue = watch('password')

  const passwordFieldError: string | undefined = useMemo(() => {
    if (!errors.password) return undefined

    if (passwordFieldValue.length < 8) {
      return t('Please fill in at least 8 characters for password.')
    }

    return errors.password.message || t('Invalid password')
  }, [errors.password, passwordFieldValue.length, t])

  return (
    <View style={{ maxWidth: 440 }}>
      <>
        <SettingsPageHeader title="Confirm password" />
        <Text fontSize={14} color={theme.secondaryText}>
          {t('Please enter your device password to see your seed')}
        </Text>
        <Controller
          control={control}
          rules={{ validate: isValidPassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputPassword
              testID="passphrase-field"
              onBlur={onBlur}
              placeholder={t('Enter Your Password')}
              autoFocus
              onChangeText={(val: string) => {
                onChange(val)
                if (keystoreState.errorMessage) {
                  dispatch({ type: 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE' })
                }
              }}
              isValid={isValidPassword(value)}
              value={value}
              onSubmitEditing={handleSubmit((data) => handleUnlock(data))}
              containerStyle={{ ...spacings.mbLg, width: 342 }}
              error={passwordFieldError}
            />
          )}
          name="password"
        />
        <Button
          testID="button-submit"
          style={{ width: 342, ...spacings.mbLg }}
          disabled={keystoreState.statuses.unlockWithSecret !== 'INITIAL' || !isValid}
          text={
            keystoreState.statuses.unlockWithSecret === 'LOADING' ? t('Submitting...') : t('Submit')
          }
          onPress={handleSubmit((data) => handleUnlock(data))}
        />
      </>
    </View>
  )
}

export default React.memo(PasswordConfirmation)
