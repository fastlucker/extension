import { Dimensions, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'
import { engine } from '@web/constants/browserAPI'

interface Style {
  [key: string]: TextStyle | ViewStyle | ImageStyle
}

export const SPACING_MI: number = 5
export const SPACING_TY: number = 10
export const SPACING_SM: number = 15
export const SPACING: number = 20
export const SPACING_MD: number = 25
export const SPACING_LG: number = 30

// In sync with the html, body and #root `min-width` in `web/style.css`
const WEB_DEVICE_WIDTH = 560
export const DEVICE_WIDTH = isWeb ? WEB_DEVICE_WIDTH : Dimensions.get('window').width
// In sync with the html, body and #root `min-height` in `web/style.css`
const WEB_DEVICE_HEIGHT = engine === 'gecko' ? 600 : 730
export const DEVICE_HEIGHT = isWeb ? WEB_DEVICE_HEIGHT : Dimensions.get('window').height

export const IS_SCREEN_SIZE_L = !isWeb && DEVICE_WIDTH >= 768
export const IS_SCREEN_SIZE_S = !isWeb && (DEVICE_HEIGHT <= 670 || DEVICE_WIDTH <= 370)

const spacings: Style = {
  mb0: { marginBottom: 0 },
  mbMi: { marginBottom: SPACING_MI },
  mbTy: { marginBottom: SPACING_TY },
  mbSm: { marginBottom: SPACING_SM },
  mb: { marginBottom: SPACING },
  mbMd: { marginBottom: SPACING_MD },
  mbLg: { marginBottom: SPACING_LG },

  mt0: { marginTop: 0 },
  mtMi: { marginTop: SPACING_MI },
  mtTy: { marginTop: SPACING_TY },
  mtSm: { marginTop: SPACING_SM },
  mt: { marginTop: SPACING },
  mtMd: { marginTop: SPACING_MD },
  mtLg: { marginTop: SPACING_LG },

  ml0: { marginLeft: 0 },
  mlMi: { marginLeft: SPACING_MI },
  mlTy: { marginLeft: SPACING_TY },
  mlSm: { marginLeft: SPACING_SM },
  ml: { marginLeft: SPACING },
  mlMd: { marginLeft: SPACING_MD },
  mlLg: { marginLeft: SPACING_LG },

  mr0: { marginRight: 0 },
  mrMi: { marginRight: SPACING_MI },
  mrTy: { marginRight: SPACING_TY },
  mrSm: { marginRight: SPACING_SM },
  mr: { marginRight: SPACING },
  mrMd: { marginRight: SPACING_MD },
  mrLg: { marginRight: SPACING_LG },

  mv0: { marginVertical: 0 },
  mvMi: { marginVertical: SPACING_MI },
  mvTy: { marginVertical: SPACING_TY },
  mvSm: { marginVertical: SPACING_SM },
  mv: { marginVertical: SPACING },
  mvMd: { marginVertical: SPACING_MD },
  mvLg: { marginVertical: SPACING_LG },

  mh0: { marginHorizontal: 0 },
  mhMi: { marginHorizontal: SPACING_MI },
  mhTy: { marginHorizontal: SPACING_TY },
  mhSm: { marginHorizontal: SPACING_SM },
  mh: { marginHorizontal: SPACING },
  mhMd: { marginHorizontal: SPACING_MD },
  mhLg: { marginHorizontal: SPACING_LG },

  pb0: { paddingBottom: 0 },
  pbMi: { paddingBottom: SPACING_MI },
  pbTy: { paddingBottom: SPACING_TY },
  pbSm: { paddingBottom: SPACING_SM },
  pb: { paddingBottom: SPACING },
  pbMd: { paddingBottom: SPACING_MD },
  pbLg: { paddingBottom: SPACING_LG },

  pt0: { paddingTop: 0 },
  ptMi: { paddingTop: SPACING_MI },
  ptTy: { paddingTop: SPACING_TY },
  ptSm: { paddingTop: SPACING_SM },
  pt: { paddingTop: SPACING },
  ptMd: { paddingTop: SPACING_MD },
  ptLg: { paddingTop: SPACING_LG },

  pl0: { paddingLeft: 0 },
  plMi: { paddingLeft: SPACING_MI },
  plTy: { paddingLeft: SPACING_TY },
  plSm: { paddingLeft: SPACING_SM },
  pl: { paddingLeft: SPACING },
  plMd: { paddingLeft: SPACING_MD },
  plLg: { paddingLeft: SPACING_LG },

  pr0: { paddingRight: 0 },
  prMi: { paddingRight: SPACING_MI },
  prTy: { paddingRight: SPACING_TY },
  prSm: { paddingRight: SPACING_SM },
  pr: { paddingRight: SPACING },
  prMd: { paddingRight: SPACING_MD },
  prLg: { paddingRight: SPACING_LG },

  pv0: { paddingVertical: 0 },
  pvMi: { paddingVertical: SPACING_MI },
  pvTy: { paddingVertical: SPACING_TY },
  pvSm: { paddingVertical: SPACING_SM },
  pv: { paddingVertical: SPACING },
  pvMd: { paddingVertical: SPACING_MD },
  pvLg: { paddingVertical: SPACING_LG },

  ph0: { paddingHorizontal: 0 },
  phMi: { paddingHorizontal: SPACING_MI },
  phTy: { paddingHorizontal: SPACING_TY },
  phSm: { paddingHorizontal: SPACING_SM },
  ph: { paddingHorizontal: SPACING },
  phMd: { paddingHorizontal: SPACING_MD },
  phLg: { paddingHorizontal: SPACING_LG }
}

// Spreading `StyleSheet.create` styles into another `style` object is not
// supported by react-native-web (styles are missing in the final object)
// {@link https://github.com/necolas/react-native-web/issues/1377}
export default isWeb ? spacings : StyleSheet.create<Style>(spacings)
