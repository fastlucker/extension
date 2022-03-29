import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'

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
    letterSpacing: 5,
    lineHeight: 25
  },
  bottomSpacing: {
    paddingBottom: 20
  }
})

export default styles
