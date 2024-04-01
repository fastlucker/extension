import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      backgroundColor: theme.primaryBackground,
      borderRadius: BORDER_RADIUS_PRIMARY,
      borderWidth: 1,
      borderColor: theme.secondaryBorder
    }
  })

export default getStyles
