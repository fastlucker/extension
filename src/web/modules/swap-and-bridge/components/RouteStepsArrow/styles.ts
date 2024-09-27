import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  arrowStart: ViewStyle
  arrowLine: ViewStyle
  badge: ViewStyle
  arrowTipWrapper: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    arrowStart: {
      width: 12,
      height: 12,
      borderRadius: 50,
      borderWidth: 1,
      backgroundColor: 'transparent'
    },
    arrowLine: {
      width: '100%',
      ...flexbox.flex1,
      height: 0,
      borderTopWidth: 1,
      borderStyle: 'dashed',
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter
    },
    badge: {
      height: 26,
      borderRadius: 50,
      ...spacings.phSm,
      ...flexbox.alignCenter,
      ...flexbox.directionRow,
      zIndex: 2
    },
    arrowTipWrapper: {
      transform: [{ translateX: -4 }]
    }
  })

export default getStyles
