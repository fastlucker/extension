import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  tabLayoutContentContainer: ViewStyle
  container: ViewStyle
  secondaryContainer: ViewStyle
  secondaryContainerWarning: ViewStyle
  swapAndBridgeToggleButtonWrapper: ViewStyle
  swapAndBridgeToggleButton: ViewStyle
  networkSelectorContainer: ViewStyle
  previewRouteContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    tabLayoutContentContainer: {
      ...spacings.pt2Xl,
      ...flexbox.alignCenter
    },
    container: {
      width: 640,
      ...flexbox.flex1
    },
    secondaryContainer: {
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phSm,
      ...spacings.pvSm
    },
    secondaryContainerWarning: {
      borderWidth: 1,
      borderColor: theme.warningDecorative,
      backgroundColor: theme.warningBackground
    },
    swapAndBridgeToggleButtonWrapper: {
      height: 6,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...flexbox.alignSelfCenter,
      zIndex: 10
    },
    swapAndBridgeToggleButton: {
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.primary,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      width: 32,
      height: 32,
      backgroundColor: theme.primaryBackground,
      shadowOffset: { width: 0, height: 3 },
      shadowColor: '#6000FF33',
      shadowRadius: 7
    },
    networkSelectorContainer: {
      ...flexbox.directionRow,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryBorder,
      ...spacings.pbTy,
      ...spacings.mbSm,
      ...spacings.phSm
    },
    previewRouteContainer: {
      backgroundColor: '#F5F6FA',
      ...common.borderRadiusPrimary,
      ...spacings.phSm,
      ...spacings.pvSm
    }
  })

export default getStyles
