import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  active: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.alignCenter,
      ...spacings.phTy,
      ...spacings.pvTy,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      backgroundColor: theme.secondaryBackground,
      borderColor: theme.tertiaryBorder
    },
    active: {
      borderColor: theme.primary
    }
  })

export default getStyles
