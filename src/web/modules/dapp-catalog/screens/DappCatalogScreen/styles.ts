import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  filterButton: ViewStyle
  filterButtonHovered: ViewStyle
  filterButtonActive: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    filterButton: {
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      ...spacings.ph,
      ...spacings.pvTy,
      overflow: 'hidden'
    },
    filterButtonHovered: {
      borderColor: theme.primary
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary
    }
  })

export default getStyles
