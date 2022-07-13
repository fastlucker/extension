import { isTokenEligible } from 'ambire-common/src/helpers/sendTxnHelpers'
import { isValidCode, isValidPassword } from 'ambire-common/src/services/validations'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Keyboard, View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import Button from '@modules/common/components/Button'
import InputPassword from '@modules/common/components/InputPassword'
import NumberInput from '@modules/common/components/NumberInput'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccountsPasswords from '@modules/common/hooks/useAccountsPasswords'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const SignActions = ({
  estimation,
  feeSpeed,
  approveTxn,
  rejectTxn,
  signingStatus,
  bundle,
  isGasTankEnabled,
  network
}: any) => {
  const {
    control,
    handleSubmit,
    resetField,
    watch,
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
  const { selectedAccHasPassword, getSelectedAccPassword } = useAccountsPasswords()
  const { addToast } = useToast()

  // reset this every time the signing status changes
  useEffect(() => {
    !signingStatus && resetField('code')
  }, [signingStatus])

  const rejectButton = rejectTxn && <Button type="danger" text={t('Reject')} onPress={rejectTxn} />

  const feeNote =
    estimation?.success && estimation?.isDeployed === false && bundle.gasLimit ? (
      <View style={[flexboxStyles.directionRow, spacings.phSm, spacings.mbSm]}>
        <InfoIcon />
        <Text fontSize={12} style={[flexboxStyles.flex1, spacings.plTy]}>
          {t(
            'NOTE: Because this is your first Ambire transaction, this fee is {{fee}}% higher than usual because we have to deploy your smart wallet. Subsequent transactions will be cheaper.',
            { fee: ((60000 / bundle.gasLimit) * 100).toFixed() }
          )}
        </Text>
      </View>
    ) : null

  const insufficientFee =
    estimation &&
    estimation.feeInUSD &&
    !isTokenEligible(estimation.selectedFeeToken, feeSpeed, estimation, isGasTankEnabled, network)

  const willFail = (estimation && !estimation.success) || insufficientFee

  const renderTitle = () => {
    return (
      <Title type="small" style={textStyles.center}>
        {t('Sign')}
      </Title>
    )
  }

  if (willFail) {
    return (
      <Panel>
        {renderTitle()}
        {feeNote}
        {rejectButton}
      </Panel>
    )
  }

  const isRecoveryMode =
    signingStatus && signingStatus.finalBundle && signingStatus.finalBundle.recoveryMode

  const handleOnSign = () => approveTxn({})

  const onSubmit = async (values: { code: string; password: string }) => {
    if (!selectedAccHasPassword) {
      return approveTxn({ quickAccCredentials: values })
    }

    try {
      const password = await getSelectedAccPassword()

      return approveTxn({
        quickAccCredentials: { code: values.code, password }
      })
    } catch (e) {
      addToast(t('Failed to confirm your identity.') as string, { error: true })
    }
  }

  if (signingStatus && signingStatus.quickAcc) {
    return (
      <Panel>
        {renderTitle()}
        {feeNote}
        <View>
          {signingStatus.confCodeRequired === 'otp' ? (
            <Text style={spacings.mbSm}>
              {selectedAccHasPassword
                ? t('Please enter your OTP code.')
                : t('Please enter your OTP code and your password.')}
            </Text>
          ) : null}
          {signingStatus.confCodeRequired === 'email' ? (
            <Text style={spacings.mbSm} weight="medium">
              {t(
                'A confirmation code was sent to your email, please enter it along with your password.'
              )}
            </Text>
          ) : null}
        </View>
        {!isRecoveryMode && !selectedAccHasPassword && (
          <Controller
            control={control}
            rules={{ validate: isValidPassword }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputPassword
                placeholder={t('Password')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                disabled={signingStatus.inProgress}
                containerStyle={spacings.mbTy}
                error={errors.password && (t('Please fill in a valid password.') as string)}
              />
            )}
            name="password"
          />
        )}
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
              disabled={signingStatus.inProgress}
              autoCorrect={false}
              isValid={isValidCode(value)}
              value={value}
              autoFocus={selectedAccHasPassword}
              error={errors.code && (t('Invalid confirmation code.') as string)}
            />
          )}
          name="code"
        />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>{rejectButton}</View>
          <View style={styles.buttonWrapper}>
            <Button
              text={signingStatus.inProgress && !!watch('code', '') ? t('Sending...') : t('Send')}
              disabled={
                signingStatus.inProgress ||
                (!selectedAccHasPassword && !watch('password', '')) ||
                !watch('code', '')
              }
              onPress={() => {
                Keyboard.dismiss()
                // Needed because of the async animation of the keyboard aware scroll view after keyboard dismiss
                setTimeout(() => {
                  handleSubmit(onSubmit)()
                }, 100)
              }}
            />
          </View>
        </View>
      </Panel>
    )
  }

  return (
    <Panel>
      {renderTitle()}
      {feeNote}
      <View style={styles.buttonsContainer}>
        {!!rejectTxn && <View style={styles.buttonWrapper}>{rejectButton}</View>}
        <View style={styles.buttonWrapper}>
          <Button
            text={!estimation || signingStatus ? t('Signing...') : t('Sign')}
            onPress={handleOnSign}
            disabled={!estimation || signingStatus}
          />
        </View>
      </View>
    </Panel>
  )
}

export default SignActions
