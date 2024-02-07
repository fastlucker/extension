import React from 'react'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()

  return (
    <Text
      fontSize={14}
      weight="regular"
      style={[textStyles.center, spacings.phSm, spacings.mbLg]}
      appearance="errorText"
    >
      {t('Add custom token')}
    </Text>
  )
}

export default React.memo(WatchTokenRequestScreen)
