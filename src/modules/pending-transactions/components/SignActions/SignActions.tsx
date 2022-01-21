import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { FontAwesome5 } from '@expo/vector-icons'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import NumberInput from '@modules/common/components/NumberInput'
import P from '@modules/common/components/P'
import Panel from '@modules/common/components/Panel'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import { isValidCode } from '@modules/common/services/validate'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { isTokenEligible } from '@modules/pending-transactions/services/helpers'

import styles from './styles'

const SignActions = ({ estimation, feeSpeed, approveTxn, rejectTxn, signingStatus }: any) => {
  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
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

  const rejectButton = rejectTxn && (
    <Button type={BUTTON_TYPES.DANGER} text={t('Reject')} onPress={rejectTxn} />
  )

  const insufficientFee =
    estimation &&
    estimation.feeInUSD &&
    !isTokenEligible(estimation.selectedFeeToken, feeSpeed, estimation)

  const willFail = (estimation && !estimation.success) || insufficientFee

  const renderTitle = () => {
    return (
      <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mb]}>
        <FontAwesome5
          style={spacings.mrTy}
          name="signature"
          size={20}
          color={colors.primaryAccentColor}
        />
        <Title hasBottomSpacing={false} color={colors.primaryAccentColor}>
          {t('Sign')}
        </Title>
      </View>
    )
  }

  if (willFail) {
    return (
      <Panel>
        {renderTitle()}
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
        {renderTitle()}
        <View>
          {signingStatus.confCodeRequired === 'otp' ? (
            <Text>{t('Please enter your OTP code and your password.')}</Text>
          ) : null}
          {signingStatus.confCodeRequired === 'email' ? (
            <Text style={[textStyles.bold, spacings.mbSm]}>
              {t(
                'A confirmation code was sent to your email, please enter it along with your password.'
              )}
            </Text>
          ) : null}
        </View>
        {!isRecoveryMode && (
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
              />
            )}
            name="password"
          />
        )}

        {!!errors.password && <P type={TEXT_TYPES.DANGER}>{t('Password is required.')}</P>}

        <Controller
          control={control}
          rules={{ validate: isValidCode }}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumberInput
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
            />
          )}
          name="code"
        />

        {!!errors.code && <P type={TEXT_TYPES.DANGER}>{t('Invalid confirmation code.')}</P>}

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>{rejectButton}</View>
          <View style={styles.buttonWrapper}>
            <Button
              text={signingStatus.inProgress ? t('Sending...') : t('Sign and send')}
              disabled={signingStatus.inProgress}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </Panel>
    )
  }

  return (
    <Panel>
      {renderTitle()}
      <View style={styles.buttonsContainer}>
        {!!rejectTxn && <View style={styles.buttonWrapper}>{rejectButton}</View>}
        <View style={styles.buttonWrapper}>
          <Button text={t('Sign')} onPress={approveTxn} disabled={!estimation || signingStatus} />
        </View>
      </View>
    </Panel>
  )
}

export default SignActions
