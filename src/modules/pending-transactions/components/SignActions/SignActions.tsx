import { isTokenEligible } from 'ambire-common/src/helpers/sendTxnHelpers'
import { isValidCode, isValidPassword } from 'ambire-common/src/services/validations'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InteractionManager, Keyboard, View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import { isWeb } from '@config/env'
import useBiometricsSign from '@modules/biometrics-sign/hooks/useBiometricsSign'
import Button from '@modules/common/components/Button'
import Checkbox from '@modules/common/components/Checkbox'
import Input from '@modules/common/components/Input'
import InputPassword from '@modules/common/components/InputPassword'
import NumberInput from '@modules/common/components/NumberInput'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import isInt from '@modules/common/utils/isInt'

import styles from './styles'

const SignActions = ({
  estimation,
  feeSpeed,
  approveTxn,
  rejectTxn,
  signingStatus,
  bundle,
  isGasTankEnabled,
  network,
  mustReplaceNonce,
  replaceTx,
  setReplaceTx
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
  const { selectedAccHasPassword, getSelectedAccPassword } = useBiometricsSign()
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

  const renderTitle = (title: string = t('Sign')) => {
    return (
      <Title type="small" style={textStyles.center}>
        {title}
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

  const handleRequestSignConfirmation = () => approveTxn({})

  const onSubmit = async (values: { code: string; password: string }) => {
    InteractionManager.runAfterInteractions(async () => {
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
    })
  }

  if (signingStatus && signingStatus.quickAcc) {
    return (
      <Panel>
        {renderTitle(t('Confirmation'))}
        {feeNote}
        <View>
          {signingStatus.confCodeRequired === 'otp' && (
            <Text style={spacings.mbSm}>
              {selectedAccHasPassword
                ? t('Please enter your OTP code.')
                : t('Please enter your OTP code and your password.')}
            </Text>
          )}
          {signingStatus.confCodeRequired === 'notRequired' && (
            <Text style={spacings.mbSm} fontSize={12} color={colors.turquoise}>
              {t(
                'You already sent 3 or more transactions to this address, confirmation code is not needed.'
              )}
            </Text>
          )}
          {signingStatus.confCodeRequired === 'notRequired' && !selectedAccHasPassword && (
            <Text style={spacings.mbSm}>{t('Please enter your password.')}</Text>
          )}
          {signingStatus.confCodeRequired === 'email' && (
            <Text style={spacings.mbSm} weight="medium">
              {t(
                'A confirmation code was sent to your email, please enter it along with your password.'
              )}
            </Text>
          )}
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
                containerStyle={signingStatus.confCodeRequired !== 'notRequired' && spacings.mbTy}
                error={errors.password && (t('Please fill in a valid password.') as string)}
              />
            )}
            name="password"
          />
        )}
        {signingStatus.confCodeRequired !== 'notRequired' && (
          <Controller
            control={control}
            rules={{ validate: isValidCode }}
            render={({ field: { onChange, onBlur, value } }) => {
              const commonProps = {
                onBlur,
                onChangeText: onChange,
                disabled: signingStatus.inProgress,
                autoCorrect: false,
                isValid: isValidCode(value),
                value,
                autoFocus: selectedAccHasPassword && !isWeb,
                error: errors.code && (t('Invalid confirmation code.') as string)
              }

              return signingStatus.confCodeRequired === 'otp' ? (
                <NumberInput
                  {...commonProps}
                  placeholder={t('Authenticator code')}
                  keyboardType="numeric"
                />
              ) : (
                <Input {...commonProps} placeholder={t('Confirmation code')} />
              )
            }}
            name="code"
          />
        )}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>{rejectButton}</View>
          <View style={styles.buttonWrapper}>
            <Button
              text={signingStatus.inProgress ? t('Confirming...') : t('Confirm')}
              disabled={
                signingStatus.inProgress ||
                (!selectedAccHasPassword && !watch('password', '')) ||
                (signingStatus.confCodeRequired !== 'notRequired' && !watch('code', ''))
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
      {
        // If there's `bundle.nonce` set, it means we're cancelling or speeding up, so this shouldn't even be visible
        // We also don't show this in any case in which we're forced to replace a particular transaction (mustReplaceNonce)
        !isInt(bundle.nonce) && !isInt(mustReplaceNonce) && !!estimation?.nextNonce?.pendingBundle && (
          <View style={spacings.mbTy}>
            <Checkbox
              value={replaceTx}
              onValueChange={() => setReplaceTx((prev: any) => !prev)}
              label={t('Replace currently pending transaction')}
            />
          </View>
        )
      }
      <View style={styles.buttonsContainer}>
        {!!rejectTxn && <View style={styles.buttonWrapper}>{rejectButton}</View>}
        <View style={styles.buttonWrapper}>
          <Button
            text={t('Sign')}
            onPress={handleRequestSignConfirmation}
            disabled={!estimation || signingStatus}
          />
        </View>
      </View>
    </Panel>
  )
}

export default React.memo(SignActions)
