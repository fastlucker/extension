import { StyleSheet, TextStyle } from 'react-native'

import { isWeb } from '@config/env'

import colors from '../colors'

interface Styles {
  highlightPrimary: TextStyle
  center: TextStyle
  right: TextStyle
  uppercase: TextStyle
  capitalize: TextStyle
  italic: TextStyle
}

const textStyles: Styles = {
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
}

export default isWeb ? textStyles : StyleSheet.create<Styles>(textStyles)
