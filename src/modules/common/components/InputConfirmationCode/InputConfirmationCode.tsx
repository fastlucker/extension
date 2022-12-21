import React from 'react'
import { useTranslation } from 'react-i18next'

import Input, { InputProps } from '@modules/common/components/Input'
import NumberInput from '@modules/common/components/NumberInput'

interface Props extends InputProps {
  confirmationType: 'otp' | 'email' | null
}

const InputConfirmationCode: React.FC<Props> = ({ confirmationType, ...rest }) => {
  const { t } = useTranslation()

  const is2FAEnabled = confirmationType === 'otp'
  const commonProps = {
    autoCorrect: false,
    autoFocus: true
  }

  // The 2FA expects a 6 digit number, as per the OTP standard
  if (is2FAEnabled) {
    return (
      <NumberInput
        placeholder={t('Authenticator OTP code')}
        keyboardType="numeric"
        {...commonProps}
        {...rest}
      />
    )
  }

  // The other confirmation method (email), expects a 6 character string,
  // and accepts any input (since the code is not per the OTP standard)
  return <Input placeholder={t('Confirmation code')} {...commonProps} {...rest} />
}

export default React.memo(InputConfirmationCode)
