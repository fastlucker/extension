import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings from '@common/styles/spacings'

interface Style {
  titleRegular: TextStyle
  titleSmall: TextStyle
  bottomSpacing: TextStyle
}

const styles = StyleSheet.create<Style>({
  titleRegular: {
    fontFamily: FONT_FAMILIES.REGULAR,
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 30
  },
  titleSmall: {
    fontFamily: FONT_FAMILIES.MEDIUM,
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 25
  },
  bottomSpacing: {
    ...spacings.pb
  }
})

export default styles
