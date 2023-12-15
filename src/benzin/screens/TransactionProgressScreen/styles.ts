import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

export const IS_MOBILE_UP_BENZIN_BREAKPOINT = Dimensions.get('window').width > 700

interface Style {
  backgroundImage: ViewStyle
  container: ViewStyle
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
    backgroundImage: {
      ...flexbox.flex1,
      width: '100%',
      height: '100%'
    },
    container: {
      ...flexbox.flex1,
      ...flexbox.alignCenter,
      ...spacings.pv,
      ...spacings.phLg
    },
    content: {
      maxWidth: 620,
      width: '100%'
    },
    logoWrapper: {
      ...flexbox.alignCenter,
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mbXl : {})
    },
    estimate: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...spacings.mbXl
    },
    steps: {
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb3Xl : spacings.mbXl)
    },
    buttons: {
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT
        ? flexbox.directionRow
        : { flexDirection: 'column-reverse' }),
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mbXl : spacings.mbMd)
    },
    openExplorer: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...(!IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mbXl : {})
    },
    openExplorerText: {
      ...spacings.mlSm,
      textDecorationLine: 'underline'
    }
  })

export default getStyles
