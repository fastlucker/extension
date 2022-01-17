import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  inputContainer: ViewStyle
  input: ViewStyle
  focused: ViewStyle
  button: ViewStyle
  info: TextStyle
  label: TextStyle
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
    flex: 1,
    ...spacings.ph,
    ...spacings.pv
  },
  focused: {
    borderBottomColor: colors.tertiaryAccentColor
  },
  info: {
    opacity: 0.5,
    fontSize: 15,
    paddingHorizontal: 5,
    ...spacings.ptTy
  },
  label: {
    fontWeight: '500',
    ...spacings.mbTy
  },
  button: {
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.inputBackgroundColor,
    backgroundColor: colors.inputBackgroundColor,
    ...spacings.phSm
  }
})

export default styles
