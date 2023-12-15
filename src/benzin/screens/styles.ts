import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  backgroundImage: ViewStyle
  content: ViewStyle
  logoWrapper: ViewStyle
  estimate: ViewStyle
  steps: ViewStyle
  buttons: ViewStyle
  openExplorer: ViewStyle
  openExplorerText: TextStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.alignCenter,
      ...spacings.pv,
      ...spacings.phLg
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    content: {
      width: 620
    },
    logoWrapper: {
      ...flexbox.alignCenter,
      ...spacings.mbXl
    },
    estimate: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...spacings.mbXl
    },
    steps: {
      ...spacings.mbTy
    },
    buttons: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter
    },
    openExplorer: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    openExplorerText: {
      ...spacings.mlSm,
      textDecorationLine: 'underline'
    }
  })

export default getStyles
