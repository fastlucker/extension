import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  buttonWrapper: ViewStyle
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
  buttonWrapper: {
    width: '100%',
    overflow: 'hidden'
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 13,
    borderColor: 'transparent'
  },
  buttonContainerStylesSizeRegular: {
    height: 50,
    ...spacings.phSm,
    ...spacings.mbSm
  },
  buttonContainerStylesSizeSmall: {
    height: 30,
    ...spacings.phTy,
    ...spacings.mbTy
  },
  buttonContainerPrimary: {
    backgroundColor: 'transparent'
  },
  buttonContainerSecondary: {
    backgroundColor: 'transparent'
  },
  buttonContainerDanger: {
    borderColor: colors.pink
  },
  buttonContainerOutline: {
    borderColor: colors.turquoise
  },
  buttonText: {
    fontFamily: 'Poppins_400Regular',
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
    color: colors.titan
  },
  buttonTextSecondary: {
    color: colors.titan
  },
  buttonTextDanger: {
    color: colors.pink
  },
  buttonTextOutline: {
    color: colors.turquoise
  },
  disabled: {
    opacity: 0.4
  }
})

export default styles
