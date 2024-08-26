import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  element: ViewStyle
  activeElement: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...spacings.mrSm,
      flexDirection: 'row',
      ...spacings.phTy,
      ...spacings.pvTy,
      borderRadius: BORDER_RADIUS_PRIMARY * 2,
      backgroundColor: theme.tertiaryBackground
    },
    element: {
      fontSize: 14,
      ...spacings.pvMi,
      ...spacings.phTy,
      color: theme.secondaryText,
      borderRadius: BORDER_RADIUS_PRIMARY
    },
    activeElement: {
      backgroundColor: theme.secondaryBackground,
      color: theme.primaryText,
      shadowColor: theme.tertiaryText,
      shadowRadius: 4
    }
  })

export default getStyles
