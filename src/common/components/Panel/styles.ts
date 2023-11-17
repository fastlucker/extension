import { StyleSheet, ViewStyle } from 'react-native'

import {
  IS_SCREEN_SIZE_DESKTOP_LARGE,
  SPACING_3XL,
  SPACING_LG,
  SPACING_XL
} from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      paddingHorizontal: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_3XL : SPACING_XL,
      paddingVertical: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_XL : SPACING_LG,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      backgroundColor: theme.primaryBackground
    }
  })

export default getStyles
