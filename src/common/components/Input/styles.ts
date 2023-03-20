import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings from '@common/styles/spacings'

interface Style {
  inputContainer: ViewStyle
  inputWrapper: ViewStyle
  input: ViewStyle
  button: ViewStyle
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
    borderBottomWidth: 2,
    height: 50
  },
  input: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MEDIUM,
    flex: 1,
    height: 48,
    ...spacings.phTy
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
