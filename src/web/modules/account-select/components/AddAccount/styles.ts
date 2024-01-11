import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  addAccountOptionContainer: ViewStyle
  addAccountOptionContainerHovered: ViewStyle
  optionIconWrapper: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    addAccountOptionContainer: {
      ...flexbox.directionRow,
      ...spacings.phTy,
      ...spacings.pvTy,
      backgroundColor: theme.primaryBackground,
      ...spacings.mbTy,
      ...common.borderRadiusPrimary,
      ...flexbox.alignCenter,
      borderColor: theme.primaryBackground,
      borderWidth: 1
    },
    addAccountOptionContainerHovered: {
      borderColor: theme.primary
    },
    optionIconWrapper: {
      width: 40,
      height: 40,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...spacings.mrTy
    }
  })

export default getStyles
