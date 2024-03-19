import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  networkIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...spacings.pv,
      backgroundColor: theme.secondaryBackground,
      borderBottomColor: theme.secondaryBorder,
      borderBottomWidth: 1
    },
    networkIcon: {
      backgroundColor: theme.tertiaryBackground,
      ...spacings.mlTy
    }
  })

export default getStyles
