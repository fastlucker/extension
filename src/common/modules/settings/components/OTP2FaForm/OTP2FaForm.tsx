import React, { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-native-qrcode-svg'

import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import useAccounts from '@common/hooks/useAccounts'
import useOtp2Fa from '@common/modules/settings/hooks/useOtp2Fa'
import spacings, { DEVICE_WIDTH } from '@common/styles/spacings'

const Otp2FaForm = ({ signerAddress, selectedAccountId, onSubmit }) => {
  const { t } = useTranslation()
  const { accounts } = useAccounts()
  const qrCodeRef: any = useRef(null)
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      emailConfirmationCode: '',
      otpCode: ''
    }
  })

  const account = accounts.find(({ id }) => id === selectedAccountId)
  const { otpAuth, sendEmail } = useOtp2Fa({ accountId: account?.id, email: account?.email })

  return (
    <>
      <Text>{t('1) Request and confirm the code sent to your Email')}</Text>
      <Button text={t('Send Email')} onPress={sendEmail} />
      <Controller
        control={control}
        rules={{ required: t('Please fill in a code.') as string }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Email confirmation code')}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            containerStyle={spacings.mbTy}
          />
        )}
        name="emailConfirmationCode"
      />

      <Text>{t('2) Scan the QR code with an authenticator app')}</Text>
      <QRCode
        value={otpAuth}
        size={DEVICE_WIDTH / 1.5}
        quietZone={10}
        getRef={qrCodeRef}
        onError={() => t('Failed to load QR code!')}
      />

      <Text>{t('3) Enter the code from your authenticator app')}</Text>
      <Controller
        control={control}
        rules={{ required: t('Please fill in a code.') as string }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('OTP code')}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            containerStyle={spacings.mbTy}
          />
        )}
        name="otpCode"
      />

      <Button
        disabled={isSubmitting || !isValid}
        text={isSubmitting ? t('Enabling...') : t('Enable 2FA')}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  )
}

export default Otp2FaForm
