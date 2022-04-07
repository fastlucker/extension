import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  buttonWrapper: ViewStyle
  buttonContainer: ViewStyle

  buttonContainerPrimary: ViewStyle
  buttonContainerSecondary: ViewStyle
  buttonContainerDanger: ViewStyle
  buttonContainerOutline: ViewStyle
  buttonContainerGhost: ViewStyle

  buttonContainerStylesSizeRegular: ViewStyle
  buttonContainerStylesSizeSmall: ViewStyle

  buttonText: TextStyle

  buttonTextPrimary: TextStyle
  buttonTextSecondary: TextStyle
  buttonTextDanger: TextStyle
  buttonTextOutline: TextStyle
  buttonTextGhost: TextStyle

  buttonTextStylesSizeRegular: TextStyle
  buttonTextStylesSizeSmall: TextStyle

  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  // Touchable element wrapper
  buttonWrapper: {
    // TODO: Figure out if this breaks stuff
    // width: '100%',
    // overflow: 'hidden'
  },

  // Default button container styles
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 13,
    borderColor: 'transparent'
  },

  // Button container styles by type
  buttonContainerPrimary: {
    backgroundColor: 'transparent'
  },
  buttonContainerSecondary: {
    backgroundColor: colors.howl
  },
  buttonContainerDanger: {
    borderColor: colors.pink
  },
  buttonContainerOutline: {
    borderColor: colors.turquoise
  },
  buttonContainerGhost: {
    backgroundColor: 'transparent'
  },

  // Button sizes (regular/small)
  buttonContainerStylesSizeRegular: {
    height: 50,
    ...spacings.phSm,
    ...spacings.mb
  },
  buttonContainerStylesSizeSmall: {
    height: 40,
    ...spacings.phTy,
    ...spacings.mbTy
  },

  // Default button text styles
  buttonText: {
    fontFamily: FONT_FAMILIES.REGULAR,
    ...textStyles.bold,
    textAlign: 'center'
  },

  // Button text styles by type
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
  buttonTextGhost: {
    color: colors.titan
  },

  // Button text sizes (regular/small)
  buttonTextStylesSizeRegular: {
    fontSize: 16
  },
  buttonTextStylesSizeSmall: {
    fontSize: 14
  },

  // Default button disabled styles
  disabled: {
    opacity: 0.4
  }
})

export default styles
