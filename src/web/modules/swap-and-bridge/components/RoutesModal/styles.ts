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
      borderColor: theme.secondaryBackground,
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phSm,
      ...spacings.pt,
      ...spacings.pbSm,
      ...spacings.mbSm
    },
    selectableItemSelected: {
      borderWidth: 1,
      borderColor: theme.primary
    }
  })

export default getStyles
