import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  title: TextStyle
  signer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      position: 'absolute',
      bottom: '100%',
      transform: [
        {
          translateY: -SPACING
        }
      ],
      ...common.borderRadiusPrimary,
      ...common.shadowPrimary,
      right: 0,
      backgroundColor: '#fff',
      width: 320,
      zIndex: 8,
      overflow: 'hidden'
    },
    title: {
      ...spacings.pvTy,
      ...spacings.pl,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryBorder,
      backgroundColor: theme.secondaryBackground,
      borderTopLeftRadius: BORDER_RADIUS_PRIMARY,
      borderTopRightRadius: BORDER_RADIUS_PRIMARY
    },
    signer: { ...spacings.pvTy, ...spacings.ph }
  })

export default getStyles
