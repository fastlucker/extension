import { StyleSheet, ViewStyle } from 'react-native'

import { IS_SCREEN_SIZE_DESKTOP_LARGE, SPACING_4XL, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  panel: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.flex1,
      backgroundColor: theme.secondaryBackground
    },

    panel: {
      marginLeft: SPACING_XL,
      marginRight: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_4XL : SPACING_XL,
      marginVertical: SPACING_XL,
      flex: 1
    }
  })

export default getStyles
