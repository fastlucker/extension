import { StyleSheet, ViewStyle } from 'react-native'

import { IS_SCREEN_SIZE_DESKTOP_LARGE, SPACING_4XL, SPACING_XL } from '@common/styles/spacings'

interface Style {
  container: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    container: {
      marginLeft: SPACING_XL,
      marginRight: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_4XL : SPACING_XL,
      marginVertical: SPACING_XL,
      flex: 1
    }
  })

export default getStyles
