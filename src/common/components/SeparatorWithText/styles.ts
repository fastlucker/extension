import { StyleSheet, TextStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  container: TextStyle
  line: TextStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20
    },
    line: {
      height: 1,
      backgroundColor: theme.secondaryBorder,
      flex: 1,
      marginHorizontal: 10
    }
  })

export default getStyles
