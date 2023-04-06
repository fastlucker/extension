import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import colors from '@common/styles/colors'

interface Style {
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontFamily: FONT_FAMILIES.REGULAR,
    color: colors.chetwode
  }
})

export default styles
