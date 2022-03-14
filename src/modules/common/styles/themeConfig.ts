import { ColorValue } from 'react-native'

import { THEME_TYPES as Themes } from '../contexts/themeContext'
import { colorPalette as colors } from './colors'

export type ThemeProps = {
  [key in keyof typeof ThemeColors]: ColorValue
}

const ThemeColors = {
  background: {
    [Themes.LIGHT]: colors.white,
    [Themes.DARK]: colors.salute
  },
  primaryText: {
    [Themes.LIGHT]: colors.black,
    [Themes.DARK]: colors.white
  },
  secondaryText: {
    [Themes.LIGHT]: colors.aluminumSilver,
    [Themes.DARK]: colors.aluminumSilver
  },
  panelBackground: {
    [Themes.LIGHT]: colors.washedBlack,
    [Themes.DARK]: colors.washedBlack
  }
}

export default ThemeColors
