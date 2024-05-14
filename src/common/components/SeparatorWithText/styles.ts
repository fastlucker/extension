import { StyleSheet, TextStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  line: TextStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    line: {
      height: 1,
      backgroundColor: theme.secondaryBorder,
      flex: 1
    }
  })

export default getStyles
