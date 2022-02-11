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
import textStyles from '@modules/common/styles/utils/text'

const AppVersion: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text style={textStyles.center} fontSize={14}>
        {t('app v{{APP_VERSION}}, build #{{BUILD_NUMBER}} (SDK v{{EXPO_SDK}})', {
          APP_VERSION,
          BUILD_NUMBER,
          EXPO_SDK
        })}
      </Text>
      <Text style={textStyles.center} fontSize={14}>
        {t('{{RELEASE_CHANNEL}} channel (runtime v{{RUNTIME_VERSION}}), {{APP_ENV}} env', {
          RELEASE_CHANNEL,
          RUNTIME_VERSION,
          APP_ENV: CONFIG.APP_ENV
        })}
      </Text>
    </>
  )
}

export default AppVersion
