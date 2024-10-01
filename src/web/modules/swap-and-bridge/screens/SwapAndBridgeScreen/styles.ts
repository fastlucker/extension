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
      width: 654,
      ...flexbox.flex1
    },
    secondaryContainer: {
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phSm,
      ...spacings.pt,
      ...spacings.pbSm
    },
    secondaryContainerWarning: {
      borderWidth: 1,
      borderColor: theme.warningDecorative,
      backgroundColor: theme.warningBackground
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
