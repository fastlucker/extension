import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import CopyIcon from '@common/assets/svg/CopyIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import InputPassword from '@common/components/InputPassword'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import SettingsPageHeader from '../../components/SettingsPageHeader'
import getStyles from './styles'

const ExportKeyScreen = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const keystoreState = useKeystoreControllerState()
  const { theme, styles } = useTheme(getStyles)
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [blurred, setBlurred] = useState<boolean>(true)
  const { navigate } = useNavigation()
  const { addToast } = useToast()

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
  // const accountAddr = params.get('accountAddr')

  // TODO: throw an error properly
  const keyAddr = params.get('keyAddr')
  if (!keyAddr) {
    return (
      <View>
        <Text>Something went wrong</Text>
      </View>
    )
  }

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
    else if (keystoreState.statuses.unlockWithSecret === 'SUCCESS') {
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

  const handleCopyText = useCallback(async () => {
    if (!privateKey) return
    try {
      await setStringAsync(privateKey)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, privateKey])

  const toggleKeyVisibility = useCallback(async () => {
    setBlurred(!blurred)
  }, [blurred])

  const returnToAccounts = () => {
    navigate(ROUTES.accountsSettings)
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
      {passwordConfirmed && privateKey && (
        <>
          <SettingsPageHeader title="Private key" />
          <View
            style={[
              blurred ? styles.blurred : styles.notBlurred,
              spacings.pvMd,
              spacings.phMd,
              { backgroundColor: theme.secondaryBackground }
            ]}
          >
            <Text fontSize={14} color={theme.secondaryText}>
              {privateKey}
            </Text>
          </View>
          <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter, spacings.mtSm]}>
            <Pressable
              onPress={handleCopyText}
              style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}
            >
              <Text fontSize={14} color={theme.secondaryText}>
                Copy your private key
              </Text>
              <CopyIcon color={theme.secondaryText} style={spacings.mlTy} />
            </Pressable>
            <Pressable
              onPress={toggleKeyVisibility}
              style={[flexbox.flex1, flexbox.directionRowReverse, flexbox.alignCenter]}
            >
              {blurred ? (
                <VisibilityIcon color={theme.secondaryText} style={spacings.mlTy} />
              ) : (
                <InvisibilityIcon color={theme.secondaryText} style={spacings.mlTy} />
              )}
              <Text fontSize={14} color={theme.secondaryText}>
                {blurred ? 'Reveal key' : 'Hide key'}
              </Text>
            </Pressable>
          </View>
          <View style={spacings.mtXl}>
            <Alert
              size="sm"
              type="warning"
              title={t(
                'Warning: Never disclose this key. Anyone with your private key can steal any assets held in your account'
              )}
            />
          </View>
          <Button style={spacings.mtTy} onPress={returnToAccounts}>
            <Text style={{ color: '#fff', ...spacings.mlSm }} fontSize={14} weight="medium">
              Done
            </Text>
          </Button>
        </>
      )}
    </View>
  )
}

export default React.memo(ExportKeyScreen)
