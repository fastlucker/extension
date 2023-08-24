import { StyleSheet, TextStyle } from 'react-native'

import colors from '@common/styles/colors'
import { FONT_FAMILIES } from '@common/hooks/useFonts'

interface Style {
  container: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    fontSize: 20,
    color: colors.martinique,
    fontFamily: FONT_FAMILIES.SEMI_BOLD
  }
})

export default styles
