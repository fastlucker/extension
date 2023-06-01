import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-native-qrcode-svg'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useAccounts from '@common/hooks/useAccounts'
import useRoute from '@common/hooks/useRoute'
import spacings, { DEVICE_WIDTH } from '@common/styles/spacings'

import useOtp2Fa from '../hooks/useOtp2Fa'

const Otp2FaScreen = () => {
  const { t } = useTranslation()
  const {
    params: { signerAddress, selectedAccountId }
  } = useRoute()
  const { accounts } = useAccounts()
  const qrCodeRef: any = useRef(null)

  const account = accounts.find(({ id }) => id === selectedAccountId)
  const { otpAuth, sendEmail } = useOtp2Fa({ accountId: account?.id, email: account?.email })

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text>{t('1) Request and confirm the code sent to your Email')}</Text>
        <Button text={t('Send Email')} onPress={sendEmail} />
        <Input />

        <Text>{t('2) Scan the QR code with an authenticator app')}</Text>
        <QRCode
          value={otpAuth}
          size={DEVICE_WIDTH / 1.5}
          quietZone={10}
          getRef={qrCodeRef}
          onError={() => t('Failed to load QR code!')}
        />

        <Text>{t('3) Enter the code from your authenticator app')}</Text>
        <Input />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default Otp2FaScreen
