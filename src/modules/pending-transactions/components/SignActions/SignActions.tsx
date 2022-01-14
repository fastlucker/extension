import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import { isTokenEligible } from '@modules/pending-transactions/services/helpers'

const SignActions = ({ estimation, feeSpeed, approveTxn, rejectTxn, signingStatus }: any) => {
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      code: '',
      password: ''
    }
  })
  const { t } = useTranslation()
  // reset this every time the signing status changes
  useEffect(
    // @ts-ignore
    () => !signingStatus && resetField('code'),
    [signingStatus]
  )

  const rejectButton = rejectTxn && <Button text={t('Reject')} onPress={rejectTxn} />

  const insufficientFee =
    estimation &&
    estimation.feeInUSD &&
    !isTokenEligible(estimation.selectedFeeToken, feeSpeed, estimation)

  const willFail = (estimation && !estimation.success) || insufficientFee

  if (willFail) {
    return (
      <Panel>
        <Title>{t('Sign')}</Title>
        {rejectButton}
      </Panel>
    )
  }

  const isRecoveryMode =
    signingStatus && signingStatus.finalBundle && signingStatus.finalBundle.recoveryMode

  const onSubmit = (values: { code: string; password: string }) => {
    approveTxn({ quickAccCredentials: values })
  }

  if (signingStatus && signingStatus.quickAcc) {
    return (
      <Panel>
        <Title>{t('Sign')}</Title>
        <View>
          {signingStatus.confCodeRequired === 'otp' ? (
            <Text>Please enter your OTP code and your password.</Text>
          ) : null}
          {signingStatus.confCodeRequired === 'email' ? (
            <Text>
              A confirmation code was sent to your email, please enter it along with your password.
            </Text>
          ) : null}
        </View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('Password')}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              autoCorrect={false}
              value={value}
              // disabled={isRecoveryMode}
              // style={isRecoveryMode ? { visibility: 'hidden' } : {}}
            />
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={
                signingStatus.confCodeRequired === 'otp'
                  ? t('Authenticator code')
                  : t('Confirmation code')
              }
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
              autoCorrect={false}
              value={value}
              // minLength={6}
              // maxLength={6}
            />
          )}
          name="code"
        />
        <View style={{}}>
          {rejectButton}
          <Button text={t('Sign and send')} onPress={isValid ? handleSubmit(onSubmit) : () => {}} />
        </View>
      </Panel>
    )
  }

  return (
    <Panel>
      <Title>{t('Sign')}</Title>
      <View style={{}}>
        {rejectButton}
        <Button text={t('Sign')} onPress={approveTxn} disabled={!estimation || signingStatus} />
      </View>
    </Panel>
  )
}

export default SignActions
