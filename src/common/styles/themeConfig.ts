import { ColorValue } from 'react-native'

import colors from './colors'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum THEME_TYPES {
  LIGHT = 'light',
  DARK = 'dark',
  // When the theme type is set to auto by the user, the app will get the system theme
  AUTO = 'auto'
}

export type ThemeProps = {
  [key in keyof typeof ThemeColors]: ColorValue | ColorValue[]
}

const ThemeColors = {
  backgroundGradient: {
    [THEME_TYPES.LIGHT]: [colors.white, colors.white],
    [THEME_TYPES.DARK]: [colors.wooed, colors.clay]
  },
  primaryText: {
    [THEME_TYPES.LIGHT]: colors.martinique,
    [THEME_TYPES.DARK]: colors.titan
  },
  secondaryText: {
    [THEME_TYPES.LIGHT]: colors.white,
    [THEME_TYPES.DARK]: colors.black
  },
  panelBackground: {
    [THEME_TYPES.LIGHT]: colors.white,
    [THEME_TYPES.DARK]: colors.black
  },
  buttonBackground: {
    [THEME_TYPES.DARK]: colors.howl,
    [THEME_TYPES.LIGHT]: colors.melrose_15
  },
  buttonBorder: {
    [THEME_TYPES.DARK]: colors.howl,
    [THEME_TYPES.LIGHT]: colors.scampi_20
  },
  buttonBorderFocused: {
    [THEME_TYPES.DARK]: colors.titan,
    [THEME_TYPES.LIGHT]: colors.violet
  },
  buttonBorderValid: {
    [THEME_TYPES.DARK]: colors.turquoise,
    [THEME_TYPES.LIGHT]: colors.greenHaze
  },
  buttonBorderInvalid: {
    [THEME_TYPES.DARK]: colors.pink,
    [THEME_TYPES.LIGHT]: colors.radicalRed
  },
  buttonText: {
    [THEME_TYPES.DARK]: colors.titan,
    [THEME_TYPES.LIGHT]: colors.martinique
  },
  buttonPlaceholderText: {
    [THEME_TYPES.DARK]: colors.waikawaGray,
    [THEME_TYPES.LIGHT]: colors.martinique_35
  }
}

export default ThemeColors
