import React, { useCallback, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import CopyIcon from '@common/assets/svg/CopyIcon'
import Button from '@common/components/Button'
import CopyText from '@common/components/CopyText'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import useAccounts from '@common/hooks/useAccounts'
import useOtp2Fa from '@common/modules/settings/hooks/useOtp2Fa'
import spacings, { DEVICE_WIDTH } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const EnableOTP2FaForm = ({ signerAddress, selectedAccountId }) => {
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
      emailConfirmCode: '',
      otpCode: ''
    }
  })

  const account = accounts.find(({ id }) => id === selectedAccountId)
  const { otpAuth, sendEmail, secret, isSendingEmail, verifyOTP } = useOtp2Fa({
    accountId: account?.id,
    email: account?.email
  })

  const onSubmit = useCallback((formValues) => verifyOTP(formValues), [verifyOTP])

  return (
    <>
      <Text fontSize={15} weight="regular" style={spacings.mbSm}>
        {t('1) Request and confirm the code sent to your Email.')}
      </Text>
      <Button
        disabled={isSendingEmail || !!secret}
        text={isSendingEmail ? t('Sending...') : secret ? t('Email Sent') : t('Send Email')}
        onPress={sendEmail}
      />
      {!!secret && (
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
              containerStyle={spacings.mbLg}
            />
          )}
          name="emailConfirmCode"
        />
      )}

      {!!secret && (
        <>
          <Text fontSize={15} weight="regular" style={spacings.mbSm}>
            {t('2) Scan the QR code with an authenticator app')}
          </Text>
          <View style={[spacings.mbLg, flexbox.center]}>
            <QRCode
              value={otpAuth}
              size={DEVICE_WIDTH / 1.5}
              quietZone={10}
              getRef={qrCodeRef}
              onError={() => t('Failed to load QR code!')}
            />
            <Text style={[spacings.mtTy, spacings.mbMi]} fontSize={15}>
              ...or copy and enter manually this setup key in your authenticator app:
            </Text>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <Text selectable weight="semiBold">
                {secret}
              </Text>
              <CopyText text={secret} style={spacings.mlMi} />
            </View>
          </View>

          <Text fontSize={15} weight="regular" style={spacings.mbSm}>
            {t('3) Enter the code from your authenticator app')}
          </Text>
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
                containerStyle={spacings.mb}
              />
            )}
            name="otpCode"
          />

          <Button
            disabled={isSubmitting || !isValid}
            text={isSubmitting ? t('Enabling...') : t('Enable 2FA')}
            onPress={handleSubmit(onSubmit)}
            style={spacings.mbLg}
          />
        </>
      )}
    </>
  )
}

export default EnableOTP2FaForm
