import { StyleSheet, ViewStyle } from 'react-native'

import { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  toggleItem: ViewStyle
  toggleItemActive: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      padding: SPACING_MI / 2,
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      height: 32
    },
    toggleItem: {
      width: 130,
      ...flexbox.alignCenter,
      flex: 1,
      ...flexbox.justifyCenter
    },
    toggleItemActive: {
      ...common.borderRadiusPrimary,
      backgroundColor: theme.primaryBackground
    }
  })

export default getStyles
