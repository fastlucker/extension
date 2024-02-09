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
      ...spacings.ptSm,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      backgroundColor: theme.secondaryBackground
    },
    summaryItem: {
      ...spacings.mbSm,
      ...spacings.phSm,
      backgroundColor: 'transparent',
      borderWidth: 0
    },
    footer: {
      ...flexbox.directionRow,
      ...flexbox.flex1,
      ...spacings.phLg,
      ...spacings.pvSm,
      borderTopColor: theme.secondaryBorder,
      borderTopWidth: 1
    },
    footerItem: {
      ...flexbox.directionRow,
      ...spacings.mr
    }
  })

export default getStyles
