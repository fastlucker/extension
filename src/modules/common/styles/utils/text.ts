import { StyleSheet, TextStyle } from 'react-native'

import colors from '../colors'

interface Styles {
  highlightPrimary: TextStyle
  highlightSecondary: TextStyle
  bold: TextStyle
}

const textStyles = StyleSheet.create<Styles>({
  highlightPrimary: {
    color: colors.primaryAccentColor
  },
  highlightSecondary: {
    color: colors.secondaryAccentColor
  },
  bold: {
    fontWeight: '700'
  }
})

export default textStyles
