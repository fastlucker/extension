import { StyleSheet, ViewStyle } from 'react-native'

import { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      padding: SPACING_MI / 2,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 14,
      height: 32
    }
  })

export default getStyles
