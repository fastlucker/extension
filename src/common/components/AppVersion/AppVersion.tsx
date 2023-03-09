import React from 'react'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import CONFIG, {
  APP_VERSION,
  BUILD_NUMBER,
  EXPO_SDK,
  isWeb,
  RELEASE_CHANNEL,
  RUNTIME_VERSION
} from '@config/env'
import { useTranslation } from '@config/localization'

import styles from './styles'

const AppVersion: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text style={styles.text} fontSize={10}>
        {t('Ambire v{{APP_VERSION}}', { APP_VERSION })}
      </Text>
      {!isWeb && (
        <Text style={styles.text} fontSize={10}>
          {t('build #{{BUILD_NUMBER}} (SDK v{{EXPO_SDK}})', {
            BUILD_NUMBER,
            EXPO_SDK
          })}
        </Text>
      )}
      {!isWeb && (
        <Text style={styles.text} fontSize={10}>
          {t('{{RELEASE_CHANNEL}} channel (runtime v{{RUNTIME_VERSION}})', {
            RELEASE_CHANNEL,
            RUNTIME_VERSION
          })}
        </Text>
      )}
      <Text style={[styles.text, spacings.mbTy]} fontSize={10}>
        {t('{{APP_ENV}} env', { APP_ENV: CONFIG.APP_ENV })}
      </Text>
    </>
  )
}

export default AppVersion
