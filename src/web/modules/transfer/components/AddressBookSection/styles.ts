import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  title: TextStyle
  button: ViewStyle
  buttonText: TextStyle
}

const getStyles = (theme: ThemeProps) => StyleSheet.create<Style>({})

export default getStyles
