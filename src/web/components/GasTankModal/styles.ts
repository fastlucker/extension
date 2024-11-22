import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

type Style = {
  containerInnerWrapper: ViewStyle
  content: ViewStyle
  balancesWrapper: ViewStyle
  descriptionTextWrapper: ViewStyle
  rightPartWrapper: ViewStyle
  rightPartInnerWrapper: ViewStyle
  buttonWrapper: ViewStyle
  overlay: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    containerInnerWrapper: {
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...common.shadowSecondary,
      maxHeight: 540
    },
    content: {
      ...common.borderRadiusPrimary,
      width: '100%'
    },
    descriptionTextWrapper: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      backgroundColor: theme.primaryBackground,
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      ...spacings.pv,
      ...spacings.ph,
      ...spacings.mbXl
    },
    balancesWrapper: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...spacings.pv,
      ...spacings.ph,
      backgroundColor: theme.primaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.mbMd
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'white',
      opacity: 0.5,
      zIndex: 1
    },
    rightPartWrapper: { ...flexbox.justifyEnd, width: 154 },
    rightPartInnerWrapper: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      alignItems: 'baseline',
      width: '100%'
    },
    buttonWrapper: { ...flexbox.alignEnd, width: '100%' }
  })

export default getStyles
