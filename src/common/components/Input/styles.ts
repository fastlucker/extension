import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

interface Style {
  inputContainer: ViewStyle
  inputWrapper: ViewStyle
  input: ViewStyle
  focused: ViewStyle
  button: ViewStyle
  error: ViewStyle
  valid: ViewStyle
  infoText: TextStyle
  errorText: TextStyle
  validText: TextStyle
  label: TextStyle
  leftIcon: ViewStyle
  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: {
    ...spacings.mbLg
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.howl,
    borderBottomWidth: 2,
    borderBottomColor: colors.howl,
    height: 50
  },
  input: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    backgroundColor: colors.howl,
    color: colors.titan,
    fontSize: 16,
    fontFamily: 'Poppins_300Light',
    flex: 1,
    height: 48,
    ...spacings.phTy
  },
  focused: {
    borderBottomColor: colors.titan
  },
  error: {
    borderBottomColor: colors.pink
  },
  valid: {
    borderBottomColor: colors.turquoise
  },
  infoText: {
    opacity: 0.5,
    paddingHorizontal: 5,
    ...spacings.ptTy,
    ...spacings.ph
  },
  errorText: {
    paddingHorizontal: 5,
    ...spacings.ptMi,
    ...spacings.ph
  },
  validText: {
    paddingHorizontal: 5,
    ...spacings.ptMi,
    ...spacings.ph
  },
  label: {
    ...spacings.mbTy
  },
  button: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    justifyContent: 'center',
    ...spacings.phTy
  },
  leftIcon: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    justifyContent: 'center',
    ...spacings.plTy
  },
  disabled: {
    opacity: 0.5
  }
})

export default styles
