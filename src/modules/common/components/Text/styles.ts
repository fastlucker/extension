import { StyleSheet, TextStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Style {
  text: TextStyle
  textRegular: TextStyle
  textSmall: TextStyle
  textCaption: TextStyle
  textInfo: TextStyle
  underline: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    color: colors.titan
  },
  textRegular: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0
  },
  textSmall: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0
  },
  textCaption: {
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 0
  },
  textInfo: {
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: -0.25
  },
  underline: {
    textDecorationLine: 'underline'
  }
})

export default styles
