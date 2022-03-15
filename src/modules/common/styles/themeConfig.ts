import { ColorValue } from 'react-native'

import { colorPalette as colors } from './colors'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum THEME_TYPES {
  LIGHT = 'light',
  DARK = 'dark',
  // When the theme type is set to auto by the user, the app will get the system theme
  AUTO = 'auto'
}

export type ThemeProps = {
  [key in keyof typeof ThemeColors]: ColorValue
}

const ThemeColors = {
  background: {
    [THEME_TYPES.LIGHT]: colors.white,
    [THEME_TYPES.DARK]: colors.salute
  },
  primaryText: {
    [THEME_TYPES.LIGHT]: colors.black,
    [THEME_TYPES.DARK]: colors.white
  },
  secondaryText: {
    [THEME_TYPES.LIGHT]: colors.aluminumSilver,
    [THEME_TYPES.DARK]: colors.aluminumSilver
  },
  panelBackground: {
    [THEME_TYPES.LIGHT]: colors.washedBlack,
    [THEME_TYPES.DARK]: colors.washedBlack
  }
}

export default ThemeColors
