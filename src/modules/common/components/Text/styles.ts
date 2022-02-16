import { StyleSheet, TextStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  text: TextStyle
  textRegular: TextStyle
  textDanger: TextStyle
  underline: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontSize: 16
  },
  textRegular: {
    color: colors.textColor
  },
  textDanger: {
    color: colors.dangerColor
  },
  underline: {
    textDecorationLine: 'underline'
  }
})

export default styles
