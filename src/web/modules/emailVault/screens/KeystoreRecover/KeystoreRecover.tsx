import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmailVaultState } from '@ambire-common/controllers/emailVault/emailVault'
import { isEmail } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import { View } from 'react-native'
import Header from '@common/modules/header/components/Header'
import useTheme from '@common/hooks/useTheme'
import getStyles from '@web/modules/onboarding/screens/OnBoardingScreen/styles'

const KeystoreRecover = () => {
  const ev = useEmailVaultControllerState()
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()
  const { theme } = useTheme(getStyles)

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

  const email = watch('email')

  useEffect(() => {
    if (keystoreState.isUnlocked) {
      alert('Keystore recovered!')
    }
  }, [keystoreState.isUnlocked])

  const handleFormSubmit = useCallback(() => {
    handleSubmit(async () => {
      dispatch({ type: 'EMAIL_VAULT_CONTROLLER_RECOVER_KEYSTORE', params: { email } })
    })()
  }, [ev?.emailVaultStates?.email, handleSubmit, dispatch, email])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="lg"
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent contentContainerStyle={spacings.mbLg}>
        <View style={spacings.mbLg}>
          <Text fontSize={20} weight="medium">
            {t('Restore Device Password')}
          </Text>
        </View>
        {ev.currentState === EmailVaultState.WaitingEmailConfirmation && (
          <View style={spacings.mbXl}>
            <Text>Waiting email confirmation ...</Text>
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
            />
          )}
          name="email"
        />
        <Button
          textStyle={{ fontSize: 14 }}
          disabled={ev.currentState === EmailVaultState.Loading || isSubmitting || !email}
          type="primary"
          text={
            // eslint-disable-next-line no-nested-ternary
            isSubmitting || ev.currentState === EmailVaultState.Loading
              ? t('Loading...')
              : t('Recover')
          }
          onPress={handleFormSubmit}
        />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default KeystoreRecover
