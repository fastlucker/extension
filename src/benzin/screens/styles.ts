import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  content: ViewStyle
  logoWrapper: ViewStyle
  steps: ViewStyle
  step: ViewStyle
  confirmedIcon: ViewStyle
  title: TextStyle
  row: ViewStyle
  buttons: ViewStyle
  openExplorer: ViewStyle
  openExplorerText: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.flex1,
    ...flexbox.alignCenter,
    ...spacings.pv,
    ...spacings.phLg
  },
  content: {
    width: 620
  },
  logoWrapper: {
    ...flexbox.alignCenter,
    ...spacings.mbXl
  },
  steps: {
    borderLeftWidth: 2,
    borderColor: '#008055',
    ...spacings.mbTy
  },
  step: {
    position: 'relative',
    ...spacings.pb2Xl,
    ...spacings.plMd
  },
  confirmedIcon: {
    width: 18,
    height: 18,
    position: 'absolute',
    left: -9,
    top: 0
  },
  title: {
    ...spacings.mb,
    lineHeight: 18 // must be the same as font-size
  },
  row: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...flexbox.justifySpaceBetween,
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

export default styles
