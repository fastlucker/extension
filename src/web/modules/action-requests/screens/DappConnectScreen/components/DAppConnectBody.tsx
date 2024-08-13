import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from '../styles'
import DAppPermissions from './DAppPermissions'

const DAppConnectBody: FC<{ isSmall: boolean }> = ({ isSmall }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  const spacingsStyle = useMemo(() => {
    if (!isSmall)
      return {
        ...spacings.phXl,
        ...spacings.pvXl,
        ...spacings.pbLg
      }

    return {
      ...spacings.phXl,
      ...spacings.pvLg,
      ...spacings.pbMd
    }
  }, [isSmall])

  return (
    <View style={[styles.contentBody, spacingsStyle]}>
      <DAppPermissions isSmall={isSmall} />
      <Text
        style={{
          opacity: 0.64,
          marginHorizontal: 'auto'
        }}
        fontSize={14}
        weight="medium"
        appearance="tertiaryText"
      >
        {t('Only connect with sites you trust')}
      </Text>
    </View>
  )
}

export default DAppConnectBody
