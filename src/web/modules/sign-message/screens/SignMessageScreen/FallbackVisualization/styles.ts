import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  standalone: ViewStyle
  header: ViewStyle
  headerText: TextStyle
  tabs: ViewStyle
  tab: ViewStyle
  activeTab: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    standalone: {
      ...spacings.pvSm,
      ...spacings.ph,
      borderWidth: 1
    },
    tabs: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.mbTy
    },
    tab: {
      width: 96,
      ...flexbox.alignCenter,
      ...spacings.pvTy,
      ...spacings.mrMi,
      borderRadius: BORDER_RADIUS_PRIMARY,
      borderWidth: 1,
      borderColor: theme.secondaryBorder
    },
    activeTab: {
      backgroundColor: theme.secondaryBackground,
      borderColor: theme.primaryBorder
    },
    container: {
      ...common.borderRadiusPrimary,
      backgroundColor: theme.secondaryBackground,
      borderColor: theme.primaryBorder,
      ...flexbox.flex1,
      minHeight: 200
    },
    header: {
      ...spacings.mb,
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerText: { ...spacings.mlMi }
  })

export default getStyles
