import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  tab: ViewStyle
  selectedTab: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      backgroundColor: theme.tertiaryBackground,
      borderColor: theme.secondaryBorder,
      ...common.borderRadiusPrimary,
      borderWidth: 2,
      ...flexbox.directionRow,
      marginHorizontal: 'auto',
      ...spacings.mbXl
    },
    tab: {
      ...common.borderRadiusPrimary,
      ...flexbox.alignCenter,
      ...spacings.pvTy,
      minWidth: 196
    },
    selectedTab: {
      backgroundColor: theme.primaryBackground
    }
  })

export default getStyles
