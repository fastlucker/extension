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
  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  disabled: {
    opacity: 0.6
  },
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
    height: 60,
    ...spacings.ph
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
    backgroundColor: colors.secondaryButtonContainerColor,
    ...spacings.ph
  }
})

export default styles
