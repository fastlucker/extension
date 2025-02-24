import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  arrowSpinnerWrapper: ViewStyle
  arrowStatus: ViewStyle
  arrowLine: ViewStyle
  badgeMiddle: ViewStyle
  badgeTop: ViewStyle
  arrowTipWrapper: ViewStyle
  arrowConnector: ViewStyle
  arrowLineSuccess: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    arrowSpinnerWrapper: {
      width: 14,
      height: 14,
      borderRadius: 50,
      backgroundColor: theme.primaryBackground
    },
    arrowStatus: {
      width: 14,
      height: 14,
      borderRadius: 50,
      borderWidth: 1,
      backgroundColor: theme.primaryBackground
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
    arrowLineSuccess: {
      borderStyle: 'solid'
    },
    badgeMiddle: {
      height: 26,
      borderRadius: 50,
      ...spacings.phSm,
      ...flexbox.alignCenter,
      ...flexbox.directionRow,
      zIndex: 2
    },
    badgeTop: {
      ...flexbox.alignCenter,
      ...flexbox.directionRow,
      zIndex: 2,
      position: 'absolute',
      bottom: 16,
      ...flexbox.alignSelfCenter,
      maxWidth: 120
    },
    arrowConnector: {
      borderTopWidth: 1,
      position: 'absolute',
      width: 6,
      height: 0
    },
    arrowTipWrapper: {
      ...flexbox.justifyCenter
    }
  })

export default getStyles
