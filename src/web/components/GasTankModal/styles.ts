import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

type Style = {
  containerInnerWrapper: ViewStyle
  content: ViewStyle
  balancesWrapper: ViewStyle
  descriptionTextWrapper: ViewStyle
  rightPartWrapper: ViewStyle
  rightPartInnerWrapper: ViewStyle
  buttonWrapper: ViewStyle
}

const { isTab } = getUiType()

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    containerInnerWrapper: {
      ...flexbox.alignCenter,
      ...flexbox.justifySpaceBetween,
      height: 540
    },
    content: {
      ...common.borderRadiusPrimary,
      width: '100%'
    },
    descriptionTextWrapper: {
      ...spacings.pbMd
    },
    balancesWrapper: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...spacings.pv,
      ...spacings.ph,
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary
    },
    rightPartWrapper: { ...flexbox.alignEnd, width: 154 },
    rightPartInnerWrapper: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      alignItems: 'baseline',
      width: '100%'
    },
    buttonWrapper: { ...flexbox.alignEnd, width: '100%' }
  })

export default getStyles
