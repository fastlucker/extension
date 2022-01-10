import React from 'react'

import { useTranslation } from '@config/localization'
import useQRCodeLogin from '@modules/auth/hooks/useQRCodeLogin'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import Wrapper from '@modules/common/components/Wrapper'

const QRCodeLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress, setError } = useQRCodeLogin()

  if (!error && !inProgress) {
    return <QRCodeScanner onScan={handleLogin} />
  }

  return (
    <Wrapper>
      {!!inProgress && <P>{t('Logging in...')}</P>}
      {!!error && (
        <>
          <P>{error}</P>
          <Button text="Try again" onPress={() => setError('')} />
        </>
      )}
    </Wrapper>
  )
}

export default QRCodeLoginScreen
