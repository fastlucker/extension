import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  content: ViewStyle
  logoWrapper: ViewStyle
  estimate: ViewStyle
  steps: ViewStyle
  step: ViewStyle
  completedStep: ViewStyle
  icon: ViewStyle
  circle: ViewStyle
  nextCircle: ViewStyle
  title: TextStyle
  row: ViewStyle
  buttons: ViewStyle
  openExplorer: ViewStyle
  openExplorerText: TextStyle
}

const iconStyle: ViewStyle = {
  width: 18,
  height: 18,
  position: 'absolute',
  left: -9,
  top: 0
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.flex1,
    ...flexbox.alignCenter,
    ...spacings.pv,
    ...spacings.phLg
    // minHeight: '100vh'
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
  step: {
    position: 'relative',
    ...spacings.pb2Xl,
    ...spacings.plMd,
    borderLeftWidth: 2,
    borderColor: '#E5E5E5'
  },
  completedStep: {
    borderColor: '#007D53'
  },
  icon: iconStyle,
  circle: {
    ...iconStyle,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#24263D59'
  },
  nextCircle: {
    borderColor: '#007D53'
  },
  title: {
    ...spacings.mb,
    textTransform: 'capitalize',
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
