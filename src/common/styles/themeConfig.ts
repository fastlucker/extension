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
    [THEME_TYPES.LIGHT]: colors.black,
    [THEME_TYPES.DARK]: colors.white
  },
  secondaryText: {
    [THEME_TYPES.LIGHT]: colors.white,
    [THEME_TYPES.DARK]: colors.black
  },
  panelBackground: {
    [THEME_TYPES.LIGHT]: colors.white,
    [THEME_TYPES.DARK]: colors.black
  }
}

export default ThemeColors
