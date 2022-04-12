import { StyleSheet, TextStyle } from 'react-native'

import colors from '../colors'

interface Styles {
  highlightPrimary: TextStyle
  highlightSecondary: TextStyle
  bold: TextStyle
  center: TextStyle
  right: TextStyle
  uppercase: TextStyle
  capitalize: TextStyle
  italic: TextStyle
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
  },
  center: {
    textAlign: 'center'
  },
  right: {
    textAlign: 'right'
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  italic: {
    fontStyle: 'italic'
  }
})

export default textStyles
