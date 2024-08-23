import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { SPACING_LG, SPACING_XL } from '@common/styles/spacings'

import getStyles from '../styles'
import DAppPermissions from './DAppPermissions'

const DAppConnectBody: FC<{ responsiveSizeMultiplier: number }> = ({
  responsiveSizeMultiplier
}) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  const spacingsStyle = useMemo(() => {
    return {
      paddingHorizontal: SPACING_XL * responsiveSizeMultiplier,
      paddingTop: SPACING_XL * responsiveSizeMultiplier,
      paddingBottom: SPACING_LG * responsiveSizeMultiplier
    }
  }, [responsiveSizeMultiplier])

  return (
    <View style={[styles.contentBody, spacingsStyle]}>
      <DAppPermissions responsiveSizeMultiplier={responsiveSizeMultiplier} />
      <Text
        style={{
          opacity: 0.64,
          marginHorizontal: 'auto'
        }}
        fontSize={14 * responsiveSizeMultiplier}
        weight="medium"
        appearance="tertiaryText"
      >
        {t('Only connect with sites you trust')}
      </Text>
    </View>
  )
}

export default React.memo(DAppConnectBody)
