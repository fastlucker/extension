import { StyleSheet, TextStyle } from 'react-native'

import colors from '../colors'

interface Styles {
  highlightPrimary: TextStyle
  highlightSecondary: TextStyle
}

const textStyles = StyleSheet.create<Styles>({
  highlightPrimary: {
    color: colors.primaryAccentColor
  },
  highlightSecondary: {
    color: colors.secondaryAccentColor
  }
})

export default textStyles
