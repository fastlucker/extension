import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
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
    ...spacings.mbSm
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 2,
    height: 50,
    borderRadius: 12
  },
  input: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    fontSize: 14,
    fontFamily: isWeb ? FONT_FAMILIES.MEDIUM : FONT_FAMILIES.LIGHT,
    flex: 1,
    height: 48,
    borderBottomWidth: 2,
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
    ...spacings.mbMI,
    ...spacings.phTy
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
    marginBottom: -2,
    borderBottomWidth: 2,
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
    opacity: 0.5,
    backgroundColor: 'transparent'
  }
})

export default styles
