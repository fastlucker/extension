import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  title: TextStyle
  button: ViewStyle
  buttonText: TextStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    title: spacings.mbSm,
    button: {
      borderColor: theme.primary,
      width: 300
    },
    buttonText: {
      color: theme.primary
    }
  })

export default getStyles
