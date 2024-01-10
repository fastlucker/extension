import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_SM } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  border: ViewStyle
  currentDApp: ViewStyle
  icon: ImageStyle
  titleWrapper: ViewStyle
  networkSelectorContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      width: '100%',
      backgroundColor: theme.secondaryBackground,
      ...spacings.ph,
      ...spacings.pvSm
    },
    currentDApp: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter
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
      ...flexbox.justifySpaceBetween
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
