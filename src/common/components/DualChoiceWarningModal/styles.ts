import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  content: ViewStyle
  titleAndIcon: ViewStyle
  buttons: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {},
    content: {
      ...spacings.phXl,
      ...spacings.pvXl,
      backgroundColor: theme.warningBackground
    },
    titleAndIcon: {
      ...flexbox.alignCenter,
      ...spacings.mbXl
    },
    buttons: {
      ...spacings.pvLg,
      ...spacings.phXl,
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween
    }
  })

export default getStyles
