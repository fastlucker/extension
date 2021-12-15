import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
// import useJsonLogin from '@modules/auth/hooks/useJsonLogin'
import Heading from '@modules/common/components/Heading'

// import P from '@modules/common/components/P'
import styles from './styles'

const QRCodeLoginScreen = () => {
  const { t } = useTranslation()
  // const { handleLogin, error, inProgress } = useJsonLogin()

  return (
    <View style={styles.container}>
      <Heading>{t('QR Code Login')}</Heading>
      {/* {!!error && <P>{error}</P>} */}
    </View>
  )
}

export default QRCodeLoginScreen
