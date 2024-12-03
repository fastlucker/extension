import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  summaryItem: ViewStyle
  footer: ViewStyle
  footerItem: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      backgroundColor: theme.secondaryBackground
    },
    summaryItem: {
      ...spacings.phSm,
      backgroundColor: 'transparent',
      borderWidth: 0
    },
    footer: {
      ...flexbox.directionRow,
      ...flexbox.flex1,
      ...flexbox.alignCenter,
      borderTopColor: theme.secondaryBorder,
      borderTopWidth: 1
    },
    footerItem: {
      ...flexbox.directionRow
    }
  })

export default getStyles
