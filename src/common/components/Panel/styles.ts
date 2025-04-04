import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  progress: ViewStyle
  innerContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...common.borderRadiusSecondary,
      backgroundColor: theme.primaryBackground,
      ...common.shadowTertiary,
      alignSelf: 'center',
      overflow: 'hidden',
      // TODO: fix it
      minHeight: 468
    },
    progress: {
      flex: 1,
      height: 4
    },
    innerContainer: {
      alignSelf: 'center',
      overflow: 'hidden',
      // TODO: fix it
      minHeight: 486
    }
  })

export default getStyles
