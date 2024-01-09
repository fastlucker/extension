import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_LG, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  border: ViewStyle
  currentDApp: ViewStyle
  icon: ImageStyle
  titleWrapper: ViewStyle
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
      top: 4,
      left: SPACING_XL,
      zIndex: 5
    }
  })

export default getStyles
