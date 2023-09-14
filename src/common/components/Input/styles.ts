import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'

interface Style {
  inputContainer: ViewStyle
  inputWrapper: ViewStyle
  input: TextStyle
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
    ...common.borderRadiusPrimary
  },
  input: {
    // Centers the content (used because of the borderBottomWidth)
    fontSize: 14,
    fontFamily: isWeb ? FONT_FAMILIES.MEDIUM : FONT_FAMILIES.LIGHT,
    flex: 1,
    height: 48,
    borderBottomWidth: 2,
    paddingTop: 2,
    marginBottom: -2,
    ...spacings.phTy
  },
  infoText: {
    opacity: 0.5,
    ...spacings.phMi,
    ...spacings.ptTy,
    ...spacings.ph
  },
  errorText: {
    ...spacings.phMi,
    ...spacings.mbMI,
    ...spacings.phTy,
    paddingTop: 2
  },
  validText: {
    ...spacings.phMi,
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
