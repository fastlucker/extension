import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  buttons: ViewStyle
  currentDApp: ViewStyle
  icon: ImageStyle
  button: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      width: '100%',
      backgroundColor: theme.secondaryBackground,
      ...spacings.phLg,
      ...spacings.pvSm,
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifySpaceBetween
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
    buttons: {
      ...flexbox.directionRow
    },
    button: {
      width: 100,
      ...spacings.mlSm,
      marginBottom: 0
    }
  })

export default getStyles
