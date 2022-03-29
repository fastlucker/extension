import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  buttonContainer: ViewStyle
  buttonContainerStylesSizeRegular: ViewStyle
  buttonContainerStylesSizeSmall: ViewStyle
  buttonContainerPrimary: ViewStyle
  buttonContainerSecondary: ViewStyle
  buttonContainerDanger: ViewStyle
  buttonContainerOutline: ViewStyle
  buttonText: TextStyle
  buttonTextStylesSizeRegular: TextStyle
  buttonTextStylesSizeSmall: TextStyle
  buttonTextPrimary: TextStyle
  buttonTextSecondary: TextStyle
  buttonTextDanger: TextStyle
  buttonTextOutline: TextStyle
  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  buttonContainer: {
    width: '100%',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  buttonContainerStylesSizeRegular: {
    height: 52,
    ...spacings.phSm,
    ...spacings.mbSm
  },
  buttonContainerStylesSizeSmall: {
    height: 30,
    ...spacings.phTy,
    ...spacings.mbTy
  },
  buttonContainerPrimary: {
    backgroundColor: colors.primaryButtonContainerColor
  },
  buttonContainerSecondary: {
    backgroundColor: colors.secondaryButtonContainerColor
  },
  buttonContainerDanger: {
    backgroundColor: colors.dangerButtonContainerColor
  },
  buttonContainerOutline: {
    borderColor: colors.outlineButtonColor
  },
  buttonText: {
    fontFamily: 'Poppins_400Regular',
    textTransform: 'uppercase',
    ...textStyles.bold,
    textAlign: 'center'
  },
  buttonTextStylesSizeRegular: {
    fontSize: 17
  },
  buttonTextStylesSizeSmall: {
    fontSize: 14
  },
  buttonTextPrimary: {
    color: colors.primaryButtonTextColor
  },
  buttonTextSecondary: {
    color: colors.secondaryButtonTextColor
  },
  buttonTextDanger: {
    color: colors.dangerButtonTextColor
  },
  buttonTextOutline: {
    color: colors.outlineButtonTextColor
  },
  disabled: {
    opacity: 0.2
  }
})

export default styles
