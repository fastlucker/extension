import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

export interface Style {
  inputContainer: ViewStyle
  borderWrapper: ViewStyle
  inputWrapper: ViewStyle
  input: TextStyle
  nativeInput: ViewStyle
  button: ViewStyle
  infoText: TextStyle
  errorText: TextStyle
  validText: TextStyle
  label: TextStyle
  leftIcon: ViewStyle
  disabled: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    inputContainer: {
      ...spacings.mbSm
    },
    borderWrapper: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: 'transparent',
      ...common.hidden
    },
    inputWrapper: {
      ...flexbox.directionRow,
      borderWidth: 1,
      height: 50,
      ...common.borderRadiusPrimary
    },
    input: {
      // Centers the content (used because of the borderBottomWidth)
      fontSize: 14,
      ...flexbox.flex1,
      height: 48,
      borderWidth: 0,
      color: theme.secondaryText,
      ...spacings.ph
    },
    nativeInput: {
      height: '100%',
      fontFamily: isWeb ? FONT_FAMILIES.REGULAR : FONT_FAMILIES.LIGHT
    },
    infoText: {
      opacity: 0.5,
      ...spacings.ptTy,
      ...spacings.ph
    },
    errorText: {
      ...spacings.phMi,
      ...spacings.mbMI,
      ...spacings.phTy,
      paddingTop: SPACING_MI / 2
    },
    validText: {
      ...spacings.phMi,
      ...spacings.ptMi,
      ...spacings.ph
    },
    label: {
      ...spacings.mbMi
    },
    button: {
      ...flexbox.justifyCenter,
      ...spacings.phTy
    },
    leftIcon: {
      ...flexbox.justifyCenter,
      ...spacings.plTy
    },
    disabled: {
      opacity: 0.5,
      backgroundColor: 'transparent'
    }
  })

export default getStyles
