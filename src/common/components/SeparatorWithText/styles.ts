import { StyleSheet, TextStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  line: TextStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    line: {
      height: 1,
      backgroundColor: theme.secondaryBorder,
      flex: 1,
      marginHorizontal: 10
    }
  })

export default getStyles
