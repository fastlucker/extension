import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  progress: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...common.borderRadiusSecondary,
      backgroundColor: theme.primaryBackground,
      ...common.shadowTertiary,
      alignSelf: 'center',
      overflow: 'hidden'
    },
    progress: {
      flex: 1,
      height: 4
    }
  })

export default getStyles
