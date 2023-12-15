import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

interface Style {
  step: ViewStyle
  completedStep: ViewStyle
  icon: ViewStyle
  circle: ViewStyle
  nextCircle: ViewStyle
  title: TextStyle
}

const iconStyle: ViewStyle = {
  width: 18,
  height: 18,
  position: 'absolute',
  left: -9,
  top: 0
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    step: {
      position: 'relative',
      ...spacings.pb2Xl,
      ...spacings.plMd,
      borderLeftWidth: 2,
      borderColor: theme.secondaryBorder,
      borderStyle: 'dotted'
    },
    completedStep: {
      borderColor: theme.successDecorative,
      borderStyle: 'solid'
    },
    icon: iconStyle,
    circle: {
      ...iconStyle,
      borderRadius: 9,
      backgroundColor: theme.primaryBackground,
      borderWidth: 1,
      borderColor: theme.secondaryBorder
    },
    nextCircle: {
      borderColor: theme.successDecorative
    },
    title: {
      ...spacings.mb,
      textTransform: 'capitalize',
      lineHeight: 18 // must be the same as font-size
    }
  })

export default getStyles
