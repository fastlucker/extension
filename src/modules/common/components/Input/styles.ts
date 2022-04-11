import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

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
  label: TextStyle
  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: {
    ...spacings.mbLg
  },
  inputWrapper: {
    overflow: 'hidden',
    borderRadius: 13,
    flexDirection: 'row',
    backgroundColor: colors.howl,
    borderBottomWidth: 2,
    borderBottomColor: colors.howl
  },
  input: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    backgroundColor: colors.howl,
    color: colors.titan,
    fontSize: 16,
    fontFamily: 'Poppins_300Light',
    flex: 1,
    height: 50,
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
  label: {
    ...spacings.mbTy
  },
  button: {
    // Centers the content (used because of the borderBottomWidth)
    paddingTop: 2,
    justifyContent: 'center',
    ...spacings.phTy
  },
  disabled: {
    opacity: 0.5
  }
})

export default styles
