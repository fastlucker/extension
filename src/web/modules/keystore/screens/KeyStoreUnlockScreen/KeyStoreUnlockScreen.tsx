import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { isValidPassword } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import InputPassword from '@common/components/InputPassword'
import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useDisableNavigatingBack from '@common/hooks/useDisableNavigatingBack'
import useNavigation from '@common/hooks/useNavigation'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import KeyStoreLogo from '@web/modules/keystore/components/KeyStoreLogo'

const FOOTER_BUTTON_HIT_SLOP = { top: 10, bottom: 15 }

const KeyStoreUnlockScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { dispatch } = useBackgroundService()
  const keystoreState = useKeystoreControllerState()

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'all',
    defaultValues: {
      password: ''
    }
  })

  useDisableNavigatingBack()

  useEffect(() => {
    if (keystoreState.errorMessage) {
      setError('password', {
        message: keystoreState.errorMessage
      })
    }
  }, [keystoreState.errorMessage, setError])

  useEffect(() => {
    if (keystoreState.errorMessage && !watch('password', '').length) {
      dispatch({ type: 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE' })
    }
  }, [keystoreState.errorMessage, watch, dispatch])

  useEffect(() => {
    if (keystoreState.isUnlocked) {
      navigate('/')
    }
  }, [navigate, keystoreState])

  const handleUnlock = useCallback(
    ({ password }: { password: string }) => {
      dispatch({
        type: 'KEYSTORE_CONTROLLER_UNLOCK_WITH_SECRET',
        params: { secretId: 'password', secret: password }
      })
    },
    [dispatch]
  )

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        !isWeb && Keyboard.dismiss()
      }}
    >
      <>
        <Header withAmbireLogo />
        <ScrollableWrapper
          contentContainerStyle={[spacings.pbLg, flexboxStyles.alignCenter]}
          type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
          extraHeight={220}
        >
          <View style={{ maxWidth: 300 }}>
            <View style={[spacings.mt2Xl, spacings.mb3Xl]}>
              <KeyStoreLogo />
            </View>

            <View style={[isWeb && spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
              <Text weight="regular" style={[spacings.mbTy, spacings.phTy]} fontSize={12}>
                {t('Enter your Ambire Device Password to unlock your wallet')}
              </Text>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    testID="passphrase-field"
                    onBlur={onBlur}
                    placeholder={t('Password')}
                    autoFocus={isWeb}
                    onChangeText={onChange}
                    isValid={isValidPassword(value)}
                    value={value}
                    onSubmitEditing={handleSubmit((data) => handleUnlock(data))}
                    error={
                      errors.password &&
                      (errors.password.message ||
                        t('Please fill in at least 8 characters for password.'))
                    }
                    containerStyle={spacings.mbTy}
                  />
                )}
                name="password"
              />

              <View style={spacings.ptMd}>
                <Button
                  testID="button-unlock"
                  disabled={
                    isSubmitting ||
                    keystoreState.statuses.unlockWithSecret === 'LOADING' ||
                    watch('password', '').length < 8
                  }
                  text={
                    isSubmitting || keystoreState.statuses.unlockWithSecret === 'LOADING'
                      ? t('Unlocking...')
                      : t('Unlock')
                  }
                  onPress={handleSubmit((data) => handleUnlock(data))}
                />
              </View>
              <View style={[flexboxStyles.justifyCenter, flexboxStyles.directionRow]}>
                <TouchableOpacity
                  onPress={() => openInTab(`tab.html#/${ROUTES.keyStoreReset}`)}
                  hitSlop={FOOTER_BUTTON_HIT_SLOP}
                >
                  <Text weight="medium" fontSize={12} underline>
                    {t('Forgot Device Password?')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollableWrapper>
      </>
    </TouchableWithoutFeedback>
  )
}

export default React.memo(KeyStoreUnlockScreen)
