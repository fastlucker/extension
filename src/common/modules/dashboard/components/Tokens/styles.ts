import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  rewardsContainer: ViewStyle
  addTokenContainer: ViewStyle
  tokenButtonIconWrapper: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      display: 'flex',
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...spacings.mbTy,
      ...spacings.ptMi,
      ...spacings.pbMi,
      ...spacings.plMi,
      ...spacings.prMi,
      borderColor: theme.secondaryBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'solid'
    },
    tokenButtonIconWrapper: {
      backgroundColor: theme.primaryBackground,
      borderRadius: 10,
      ...flexbox.center,
      width: 35,
      height: 35
    },
    rewardsContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.scampi_20
    },
    addTokenContainer: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.primary,
      backgroundColor: colors.melrose_15,
      ...flexbox.justifyCenter,
      ...spacings.mt
    }
  })

export default getStyles
