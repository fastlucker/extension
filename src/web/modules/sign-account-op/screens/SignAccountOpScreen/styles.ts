import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  leftSideContainer: ViewStyle
  separator: ViewStyle
  warningsModal: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.directionRow
    },
    leftSideContainer: {
      flexBasis: '60%',
      justifyContent: 'flex-start',
      height: '100%'
    },
    separator: {
      width: 1,
      backgroundColor: theme.secondaryBorder
    },
    warningsModal: {
      width: 492,
      backgroundColor: theme.primaryBackground,
      paddingHorizontal: 0,
      paddingVertical: 0,
      overflow: 'hidden'
    }
  })

export default getStyles
