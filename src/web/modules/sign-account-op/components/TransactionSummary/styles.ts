import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  warningContainer: ViewStyle
  body: ViewStyle
  bodyText: TextStyle
  explorerIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      backgroundColor: theme.secondaryBackground,
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      borderColor: theme.secondaryBorder
    },
    warningContainer: {
      borderWidth: 1,
      backgroundColor: theme.warningBackground,
      borderColor: theme.warningDecorative
    },
    body: {
      ...spacings.pvTy,
      ...spacings.phSm
    },
    bodyText: {
      ...spacings.mbTy,
      color: theme.secondaryText
    },
    explorerIcon: {
      marginLeft: -SPACING_MI
    }
  })

export default getStyles
