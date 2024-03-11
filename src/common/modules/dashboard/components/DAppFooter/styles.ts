import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_SM } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  footerContainer: ViewStyle
  container: ViewStyle
  border: ViewStyle
  currentDApp: ViewStyle
  icon: ImageStyle
  titleWrapper: ViewStyle
  networkSelectorContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    footerContainer: {
      ...spacings.phSm,
      ...spacings.pbSm,
      width: '100%'
    },
    container: {
      ...flexbox.flex1,
      backgroundColor: theme.secondaryBackground,
      ...spacings.phSm,
      ...spacings.pvSm,
      ...common.borderRadiusPrimary,
      shadowOffset: {
        width: 0,
        height: -3
      },
      shadowColor: '#CACDE699',
      shadowOpacity: 1,
      shadowRadius: 6
    },
    currentDApp: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.flex1
    },
    icon: {
      width: 32,
      height: 32,
      ...common.borderRadiusPrimary
    },
    border: {
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      borderColor: theme.secondaryBorder,
      ...flexbox.directionRow,
      ...spacings.phSm,
      ...spacings.pvTy,
      ...flexbox.alignCenter,
      ...flexbox.justifySpaceBetween,
      ...flexbox.flex1
    },
    titleWrapper: {
      backgroundColor: theme.secondaryBackground,
      ...spacings.phTy,
      position: 'absolute',
      top: -7,
      left: SPACING_SM,
      zIndex: 50
    },
    networkSelectorContainer: {
      ...spacings.phSm,
      ...spacings.pvSm,
      backgroundColor: theme.infoBackground,
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      borderColor: theme.primary,
      ...flexbox.directionRow,
      ...spacings.mbLg
    }
  })

export default getStyles
