import { ColorValue } from 'react-native'

import { WEB_ROUTES } from '@common/modules/router/constants/common'

import colors from './colors'

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
  primary: {
    [THEME_TYPES.DARK]: '#6000FF',
    [THEME_TYPES.LIGHT]: '#6000FF'
  },
  primaryLight: {
    [THEME_TYPES.DARK]: '#8B3DFF',
    [THEME_TYPES.LIGHT]: '#8B3DFF'
  },
  primaryText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#141833'
  },
  secondaryText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#54597A'
  },
  primaryBorder: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#767DAD'
  },
  secondaryBorder: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#B8BDE0'
  },
  primaryBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#FFFFFF'
  },
  secondaryBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#F2F3FA'
  },
  tertiaryBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#E7E9FB'
  },
  accent1: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#007D53'
  },
  accent2: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#806E33'
  },
  accent3: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#D9024A'
  }
}

export const lightOnlyRoutesOnMobile = []

export const lightOnlyRoutesOnWeb = [
  WEB_ROUTES.createEmailVault,
  WEB_ROUTES.keyStoreSetup,
  WEB_ROUTES.getStarted,
  WEB_ROUTES.terms,
  WEB_ROUTES.authEmailAccount,
  WEB_ROUTES.authEmailLogin,
  WEB_ROUTES.authEmailRegister,
  WEB_ROUTES.ambireAccountJsonLogin,
  WEB_ROUTES.ambireAccountJsonLoginPasswordConfirm,
  WEB_ROUTES.ambireAccountLoginPasswordConfirm,
  WEB_ROUTES.externalSigner,
  WEB_ROUTES.onboarding,
  WEB_ROUTES.hardwareWalletSelect,
  WEB_ROUTES.hardwareWalletLedger,
  WEB_ROUTES.accountAdder,
  WEB_ROUTES.accountPersonalize,
  WEB_ROUTES.dashboard,
  WEB_ROUTES.signMessage,
  WEB_ROUTES.transfer,
  WEB_ROUTES.signAccountOp
]

export default ThemeColors
