import React from 'react'

import CONFIG, {
  APP_VERSION,
  BUILD_NUMBER,
  EXPO_SDK,
  RELEASE_CHANNEL,
  RUNTIME_VERSION
} from '@config/env'
import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

const AppVersion: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text style={styles.text} fontSize={10}>
        {t('Ambire Wallet app v{{APP_VERSION}}', { APP_VERSION })}
      </Text>
      <Text style={styles.text} fontSize={10}>
        {t('build #{{BUILD_NUMBER}} (SDK v{{EXPO_SDK}})', {
          BUILD_NUMBER,
          EXPO_SDK
        })}
      </Text>
      <Text style={styles.text} fontSize={10}>
        {t('{{RELEASE_CHANNEL}} channel (runtime v{{RUNTIME_VERSION}})', {
          RELEASE_CHANNEL,
          RUNTIME_VERSION
        })}
      </Text>
      <Text style={[styles.text, spacings.mbTy]} fontSize={10}>
        {t('{{APP_ENV}} env', { APP_ENV: CONFIG.APP_ENV })}
      </Text>
    </>
  )
}

export default AppVersion
