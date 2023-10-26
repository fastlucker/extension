import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  containerHover: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.alignCenter,
      backgroundColor: colors.melrose_15,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'transparent'
    },
    containerHover: {
      backgroundColor: theme.primaryLight,
      borderStyle: 'solid',
      borderColor: theme.primary
    }
  })

export default getStyles
