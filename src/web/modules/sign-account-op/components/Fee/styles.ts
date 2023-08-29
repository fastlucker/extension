import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'

interface Style {
  label: TextStyle
  amount: TextStyle
}

const styles = StyleSheet.create<Style>({
  label: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MEDIUM,
    marginBottom: 4
  },
  amount: {
    fontSize: 14
  }
})

export default styles
