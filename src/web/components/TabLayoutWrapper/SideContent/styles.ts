import { StyleSheet, ViewStyle } from 'react-native'

import spacings, {
  IS_SCREEN_SIZE_DESKTOP_LARGE,
  SPACING_MD,
  SPACING_XL
} from '@common/styles/spacings'

interface Style {
  sideContentContainer: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    sideContentContainer: {
      ...spacings.ph0,
      paddingLeft: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_XL : SPACING_MD,
      maxWidth: 582,
      minWidth: 300,
      width: IS_SCREEN_SIZE_DESKTOP_LARGE ? '30%' : 394,
      overflow: 'hidden'
    }
  })

export default getStyles
