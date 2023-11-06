import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  inputContainer: ViewStyle
  borderWrapper: ViewStyle
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

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    inputContainer: {
      ...spacings.mbSm
    },
    borderWrapper: {
      borderWidth: 2,
      borderRadius: 9,
      borderColor: 'transparent',
      ...common.hidden
    },
    inputWrapper: {
      flexDirection: 'row',
      borderWidth: 1,
      height: 50,
      ...common.borderRadiusPrimary
    },
    input: {
      // Centers the content (used because of the borderBottomWidth)
      fontSize: 14,
      fontFamily: isWeb ? FONT_FAMILIES.MEDIUM : FONT_FAMILIES.LIGHT,
      flex: 1,
      height: 48,
      borderWidth: 0,
      color: theme.secondaryText,
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
      justifyContent: 'center',
      ...spacings.phTy
    },
    leftIcon: {
      justifyContent: 'center',
      ...spacings.plTy
    },
    disabled: {
      opacity: 0.5,
      backgroundColor: 'transparent'
    }
  })

export default getStyles
