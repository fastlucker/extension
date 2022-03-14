import { colorPalette as colors } from './colors'

export enum Themes {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum Styles {
  background = 'background',
  primaryText = 'primaryText',
  secondaryText = 'secondaryText',
  panelBackground = 'panelBackground'
}

export type ThemeColorsConfig = {
  [key in Styles]: {
    [Themes.LIGHT]: string
    [Themes.DARK]: string
  }
}

const ThemeColors: ThemeColorsConfig = {
  [Styles.background]: {
    [Themes.LIGHT]: colors.white,
    [Themes.DARK]: colors.salute
  },
  [Styles.primaryText]: {
    [Themes.LIGHT]: colors.black,
    [Themes.DARK]: colors.white
  },
  [Styles.secondaryText]: {
    [Themes.LIGHT]: colors.aluminumSilver,
    [Themes.DARK]: colors.aluminumSilver
  },
  [Styles.panelBackground]: {
    [Themes.LIGHT]: colors.washedBlack,
    [Themes.DARK]: colors.washedBlack
  }
}

export default ThemeColors
