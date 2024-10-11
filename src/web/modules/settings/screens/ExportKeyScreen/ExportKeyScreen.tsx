import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isSmartAccount } from '@ambire-common/libs/account/account'
import { isValidPassword } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAccounts from '@common/hooks/useAccounts'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import SettingsPageHeader from '../../components/SettingsPageHeader'
import PrivateKeyExport from './PrivateKeyExport'
import SmartAccountExport from './SmartAccountExport'

const ExportKeyScreen = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const keystoreState = useKeystoreControllerState()
  const { theme } = useTheme()
  const { accounts } = useAccounts()
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)
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
  const { search } = useRoute()
  const params = new URLSearchParams(search)

  const accountAddr = params.get('accountAddr')
  const account = useMemo(
    () => accounts.find((acc) => acc.addr === accountAddr),
    [accounts, accountAddr]
  )
  const isSA = isSmartAccount(account)

  const keyAddr = params.get('keyAddr')
  const key = useMemo(
    () => keystoreState.keys.find((aKey) => aKey.addr === keyAddr),
    [keystoreState.keys, keyAddr]
  )

  useEffect(() => {
    const onReceiveOnTimeData = (data: any) => {
      if (!data.privateKey) return

      setPrivateKey(data.privateKey)
    }

    eventBus.addEventListener('receiveOneTimeData', onReceiveOnTimeData)

    return () => eventBus.removeEventListener('addToast', onReceiveOnTimeData)
  }, [])

  useEffect(() => {
    if (keystoreState.errorMessage) setError('password', { message: keystoreState.errorMessage })
    else if (keyAddr && keystoreState.statuses.unlockWithSecret === 'SUCCESS') {
      setPasswordConfirmed(true)
      dispatch({
        type: 'KEYSTORE_CONTROLLER_SEND_PRIVATE_KEY_OVER_CHANNEL',
        params: { keyAddr }
      })
    }
  }, [
    keystoreState.errorMessage,
    keystoreState.statuses.unlockWithSecret,
    setError,
    dispatch,
    keyAddr
  ])

  const handleUnlock = useCallback(
    (data: any) => {
      dispatch({
        type: 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET',
        params: { secretId: 'password', secret: data.password }
      })
    },
    [dispatch]
  )

  const passwordFieldValue = watch('password')

  const passwordFieldError: any = useMemo(() => {
    if (!errors.password) return undefined

    if (passwordFieldValue.length < 8) {
      return t('Please fill in at least 8 characters for password.')
    }

    return errors.password.message || t('Invalid password')
  }, [errors.password, passwordFieldValue.length, t])

  if (!account || !key) {
    return (
      <View>
        <Text>Something went wrong as the account/key was not found. Please contract support</Text>
      </View>
    )
  }

  return (
    <View style={{ maxWidth: 440 }}>
      {!passwordConfirmed && (
        <>
          <SettingsPageHeader title="Confirm password" />
          <Text fontSize={14} color={theme.secondaryText}>
            {t('Please enter your device password to see your private key')}
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
              keystoreState.statuses.unlockWithSecret === 'LOADING'
                ? t('Submitting...')
                : t('Submit')
            }
            onPress={handleSubmit((data) => handleUnlock(data))}
          />
        </>
      )}
      {passwordConfirmed && privateKey && !isSA && <PrivateKeyExport privateKey={privateKey} />}
      {passwordConfirmed && privateKey && isSA && (
        <SmartAccountExport account={account} privateKey={privateKey} />
      )}
    </View>
  )
}

export default React.memo(ExportKeyScreen)
