import { isValidPassword } from 'ambire-common/src/services/validations'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import AmbireLogo from '@modules/auth/components/AmbireLogo'
import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress, data } = useJsonLogin()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      password: ''
    }
  })

  return (
    <GradientBackgroundWrapper>
      <Wrapper contentContainerStyle={spacings.mbLg}>
        <AmbireLogo />
        {!!data && !!data?.email && !error && (
          <Input
            value={data.email}
            isValid
            validLabel={t('Imported a valid Ambire account')}
            disabled
            containerStyle={spacings.mbTy}
          />
        )}
        {!!data && !!data?.id && !error && (
          <Controller
            control={control}
            rules={{ validate: isValidPassword }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputPassword
                onBlur={onBlur}
                placeholder={t('Account password')}
                onChangeText={onChange}
                isValid={isValidPassword(value)}
                value={value}
                info={t('Enter the password for account {{accountAddr}}', {
                  accountAddr: `${data?.id?.slice(0, 4)}...${data?.id?.slice(-4)}`
                })}
                error={
                  errors.password &&
                  (t('Please fill in at least 8 characters for password.') as string)
                }
              />
            )}
            name="password"
          />
        )}
        <Button
          disabled={inProgress || (!error && !!data && !watch('password', ''))}
          text={inProgress ? t('Importing...') : data ? t('Log In') : t('Select File')}
          onPress={handleSubmit(handleLogin)}
          hasBottomSpacing={!error}
        />
        {!!error && (
          <View style={spacings.ptTy}>
            <Text appearance="danger" fontSize={12} style={spacings.ph}>
              {error}
            </Text>
          </View>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default JsonLoginScreen
