import { isEmail } from 'ambire-common/src/services/validations'

import React, { useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

import Checkbox from '@common/components/Checkbox'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import useRoute from '@common/hooks/useRoute'
import { ROUTES } from '@common/modules/router/constants/common'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'

const CreateNewEmailVaultScreen = () => {
  const { t } = useTranslation()
  const route = useRoute()
  const [step, setCurrentStep] = useState(0)

  const { navigate } = useNavigation()

  const handleAuthButtonPress = useCallback((nextRoute: any) => navigate(nextRoute), [navigate])

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      nextRoute: route?.params?.nextRoute || ROUTES.getStarted
    }
  })
  const steps = [
    t('Create Email\nVault'),
    t('Email\nConfirmation'),
    t('Setup Key\nStore'),
    t('Personalize\nAccounts')
  ]
  return (
    <>
      <AuthLayoutWrapperMainContent showStepper step={step} steps={steps}>
        <View style={[styles.mainContentWrapper]}>
          <Text
            weight="medium"
            fontSize={20}
            color={colors.martinique}
            style={{ ...spacings.mbLg, textAlign: 'center' }}
          >
            Create Or Enter Email Vault
          </Text>
          <Controller
            control={control}
            rules={{ validate: isEmail }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder={t('Enter Email')}
                onChangeText={onChange}
                // onSubmitEditing={handleSubmit(handleLogin)}
                value={value}
                autoFocus={isWeb}
                isValid={isEmail(value)}
                // validLabel={pendingLoginAccount ? t('Email address confirmed') : ''}
                keyboardType="email-address"
                // disabled={!!requiresEmailConfFor && !pendingLoginAccount}
                // info={
                //   requiresEmailConfFor && !pendingLoginAccount
                //     ? t(
                //         'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
                //         { email: requiresEmailConfFor?.email }
                //       )
                //     : ''
                // }
                error={errors.email && (t('Please fill in a valid email.') as string)}
                // containerStyle={requiresPassword ? spacings.mbTy : null}
              />
            )}
            name="email"
          />

          <Checkbox label={t('Enable local key store recovery with email')} />
          <Button
            disabled={isSubmitting || !watch('email', '')}
            text={isSubmitting ? t('Setting up...') : t('Continue')}
            // onPress={handleSubmit(createVault)}
            onPress={() => handleAuthButtonPress(ROUTES.authEmailLogin)}
          />
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="medium" style={spacings.mb} color={colors.zircon} fontSize={20}>
          {t('Email Vaults')}
        </Text>
        <Text weight="regular" style={spacings.mbTy} color={colors.zircon} fontSize={16}>
          {t(
            "Email vaults are stored in the cloud, on Ambire's infrastructure and they are used for recovery of smart accounts, recovery of your extension passphrase, as well as optionally backing up your keys."
          )}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default CreateNewEmailVaultScreen
