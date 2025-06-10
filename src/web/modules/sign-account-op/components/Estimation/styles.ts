import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  selectedFee: ViewStyle
  gasTankContainer: ViewStyle
  estimationContainer: ViewStyle
  estimationScrollView: ViewStyle
  spinner: ViewStyle
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
    estimationContainer: {
      ...flexbox.flex1,
      ...spacings.pbLg
    },
    estimationScrollView: {
      height: '100%'
    },
    spinner: {
      alignSelf: 'center'
    }
  })

export default getStyles
