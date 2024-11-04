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
  tertiaryText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#767DAD'
  },
  primaryBorder: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#767DAD'
  },
  secondaryBorder: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#CACDE6'
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
  quaternaryBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#767DAD14'
  },
  backdrop: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#54597ACC'
  },
  // Success
  successText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#006D3F'
  },
  successDecorative: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#018649'
  },
  successBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#EBF5F0'
  },
  // Info
  infoText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#35058E'
  },
  infoDecorative: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#8B3DFF'
  },
  infoBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#F6F0FF'
  },
  // Info 2
  info2Text: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#0750A1'
  },
  info2Decorative: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#0079FF'
  },
  info2Background: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#0079FF14'
  },
  // Warning
  warningText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#944901'
  },
  warningDecorative: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#CA7E04'
  },
  warningBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#FBF5EB'
  },
  // Error
  errorText: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#A10119'
  },
  errorDecorative: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#EA0129'
  },
  errorBackground: {
    [THEME_TYPES.DARK]: colors.greenHaze,
    [THEME_TYPES.LIGHT]: '#FEEBEE'
  },
  featureDecorative: {
    [THEME_TYPES.DARK]: '#3851FF',
    [THEME_TYPES.LIGHT]: '#3851FF'
  },
  featureBackground: {
    [THEME_TYPES.DARK]: '#ECF4FD',
    [THEME_TYPES.LIGHT]: '#ECF4FD'
  }
}

export const iconColors = {
  warning: '#CA7E04',
  primary: '#54597A',
  secondary: colors.martinique,
  danger: '#EA0129',
  favorite: '#ffbc00',
  dark: '#141833',
  black: '#000',
  white: '#fff'
}

export const lightOnlyRoutesOnMobile = []

export const lightOnlyRoutesOnWeb = [
  WEB_ROUTES.keyStoreSetup,
  WEB_ROUTES.getStarted,
  WEB_ROUTES.terms,
  WEB_ROUTES.authEmailAccount,
  WEB_ROUTES.authEmailLogin,
  WEB_ROUTES.authEmailRegister,
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
