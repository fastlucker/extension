import React from 'react'

import { useTranslation } from '@config/localization'
import useQRCodeLogin from '@modules/auth/hooks/useQRCodeLogin'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import { TEXT_TYPES } from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'

const QRCodeLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress, setError } = useQRCodeLogin()

  if (!error && !inProgress) {
    return (
      <Wrapper>
        <QRCodeScanner onScan={handleLogin} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {!!inProgress && <P>{t('Logging in...')}</P>}
      {!!error && (
        <>
          <P type={TEXT_TYPES.DANGER}>{error}</P>
          <Button text="Try again" onPress={() => setError('')} />
        </>
      )}
    </Wrapper>
  )
}

export default QRCodeLoginScreen
