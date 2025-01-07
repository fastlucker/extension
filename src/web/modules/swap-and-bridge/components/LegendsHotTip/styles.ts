import { StyleSheet, ViewStyle } from 'react-native'

import { SPACING_SM } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      backgroundColor: theme.infoBackground,
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      borderColor: theme.infoDecorative,
      padding: SPACING_SM,
      width: 186,
      overflow: 'hidden'
    }
  })

export default getStyles
