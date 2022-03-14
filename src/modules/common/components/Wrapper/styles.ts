import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeColorsConfig } from '@modules/common/styles/ themeConfig'
import spacings from '@modules/common/styles/spacings'

interface Style {
  wrapper: ViewStyle
  contentContainerStyle: ViewStyle
}

const styles = (theme: ThemeColorsConfig) =>
  StyleSheet.create<Style>({
    wrapper: {
      flex: 1,
      backgroundColor: theme.background,
      ...spacings.phTy
    },
    contentContainerStyle: {
      ...spacings.pvSm,
      flexGrow: 1
    }
  })

export default styles
