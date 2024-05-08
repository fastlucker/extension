import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  selectedFee: ViewStyle
  gasTankContainer: ViewStyle
  gasTankText: TextStyle
  estimationContainer: ViewStyle
  estimationScrollView: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    selectedFee: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.primary
    },
    gasTankContainer: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween
    },
    gasTankText: {
      color: colors.greenHaze,
      fontSize: 14
    },
    estimationContainer: {
      ...flexbox.flex1
    },
    estimationScrollView: {
      height: '100%'
    }
  })

export default getStyles
