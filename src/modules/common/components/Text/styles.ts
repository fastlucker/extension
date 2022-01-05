import { StyleSheet, TextStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  text: TextStyle
  underline: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    color: colors.textColor,
    fontSize: 16
  },
  underline: {
    textDecorationLine: 'underline'
  }
})

export default styles
