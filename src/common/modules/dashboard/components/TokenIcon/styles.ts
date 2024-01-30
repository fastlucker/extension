import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  networkIconWrapper: ViewStyle
  networkIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    networkIconWrapper: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 3,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      borderRadius: 12
    },
    networkIcon: {
      backgroundColor: theme.primaryBackground,
      borderRadius: 12
    }
  })

export default getStyles
