import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  inputContainer: ViewStyle
  input: ViewStyle
  focused: ViewStyle
  info: TextStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: {
    ...spacings.mbSm
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.inputBackgroundColor,
    backgroundColor: colors.inputBackgroundColor,
    color: colors.inputColor,
    fontSize: 19,
    ...spacings.ph,
    ...spacings.pv
  },
  focused: {
    borderBottomColor: colors.tertiaryAccentColor
  },
  info: {
    ...spacings.ptTy
  }
})

export default styles
