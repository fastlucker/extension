import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  separator: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    separator: {
      width: 1,
      height: '100%',
      backgroundColor: theme.secondaryBorder,
      ...spacings.mhXl
    }
  })

export default getStyles
