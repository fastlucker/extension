import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  selectableItemContainer: ViewStyle
  selectableItemSelected: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    selectableItemContainer: {
      borderWidth: 1,
      borderColor: theme.primaryBackground,
      backgroundColor: theme.primaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.pv,
      ...spacings.ph,
      ...spacings.mbSm
    },
    selectableItemSelected: {
      borderWidth: 1,
      borderColor: theme.primary
    }
  })

export default getStyles
