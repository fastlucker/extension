import React from 'react'

import { useTranslation } from '@config/localization'
import useQRCodeLogin from '@modules/auth/hooks/useQRCodeLogin'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

const QRCodeLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress, setError } = useQRCodeLogin()

  if (!error && !inProgress) {
    return (
      <GradientBackgroundWrapper>
        <QRCodeScanner onScan={handleLogin} />
      </GradientBackgroundWrapper>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        {!!inProgress && <Text style={spacings.mbSm}>{t('Logging in...')}</Text>}
        {!!error && (
          <>
            <Text appearance="danger" style={spacings.mbSm}>
              {error}
            </Text>
            <Button text="Try again" onPress={() => setError('')} />
          </>
        )}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default QRCodeLoginScreen
