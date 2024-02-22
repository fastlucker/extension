import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  panel: ViewStyle
  topUpPanel: ViewStyle
  container: ViewStyle
  separator: ViewStyle
  spinnerContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    panel: {
      maxHeight: '100%'
    },
    topUpPanel: {
      ...spacings.pvXl,
      ...spacings.phXl
    },
    container: {
      ...flexbox.directionRow,
      ...flexbox.flex1,
      width: '100%'
    },
    separator: {
      width: 1,
      height: '100%',
      backgroundColor: theme.secondaryBorder
    },
    spinnerContainer: {
      ...flexbox.center,
      ...flexbox.flex1
    }
  })

export default getStyles
