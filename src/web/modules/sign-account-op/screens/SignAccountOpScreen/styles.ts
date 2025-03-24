import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  warningsModal: ViewStyle
  footer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    warningsModal: {
      width: 492,
      backgroundColor: theme.primaryBackground,
      paddingHorizontal: 0,
      paddingVertical: 0,
      overflow: 'hidden'
    },
    footer: {
      ...spacings.pvLg,
      ...spacings.phLg,
      backgroundColor: theme.primaryBackground,
      shadowColor: '#B8BDE080',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.64,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12
    }
  })

export default getStyles
