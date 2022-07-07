import { StyleSheet, TextStyle } from 'react-native'

import colors from '../colors'

interface Styles {
  highlightPrimary: TextStyle
  center: TextStyle
  right: TextStyle
  uppercase: TextStyle
  capitalize: TextStyle
  italic: TextStyle
}

const textStyles = StyleSheet.create<Styles>({
  highlightPrimary: {
    color: colors.heliotrope
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
