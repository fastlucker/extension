import { Dimensions, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  [key: string]: TextStyle | ViewStyle | ImageStyle
}

export const SPACING_MI: number = 5
export const SPACING_TY: number = 10
export const SPACING_SM: number = 15
export const SPACING: number = 20
export const SPACING_MD: number = 25
export const SPACING_LG: number = 30

export const DEVICE_WIDTH = Dimensions.get('window').width
export const DEVICE_HEIGHT = Dimensions.get('window').height

const spacings = StyleSheet.create<Style>({
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
  mrMi: { marginVertical: SPACING_MI },
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
  mhMi: { marginVertical: SPACING_MI },
  mhTy: { marginHorizontal: SPACING_TY },
  mhSm: { marginHorizontal: SPACING_SM },
  mh: { marginHorizontal: SPACING },
  mhMd: { marginHorizontal: SPACING_MD },
  mhLg: { marginHorizontal: SPACING_LG },

  pb0: { paddingBottom: 0 },
  pbMi: { marginVertical: SPACING_MI },
  pbTy: { paddingBottom: SPACING_TY },
  pbSm: { paddingBottom: SPACING_SM },
  pb: { paddingBottom: SPACING },
  pbMd: { paddingBottom: SPACING_MD },
  pbLg: { paddingBottom: SPACING_LG },

  pt0: { paddingTop: 0 },
  ptMi: { marginVertical: SPACING_MI },
  ptTy: { paddingTop: SPACING_TY },
  ptSm: { paddingTop: SPACING_SM },
  pt: { paddingTop: SPACING },
  ptMd: { paddingTop: SPACING_MD },
  ptLg: { paddingTop: SPACING_LG },

  pl0: { paddingLeft: 0 },
  plMi: { marginVertical: SPACING_MI },
  plTy: { paddingLeft: SPACING_TY },
  plSm: { paddingLeft: SPACING_SM },
  pl: { paddingLeft: SPACING },
  plMd: { paddingLeft: SPACING_MD },
  plLg: { paddingLeft: SPACING_LG },

  pr0: { paddingRight: 0 },
  prMi: { marginVertical: SPACING_MI },
  prTy: { paddingRight: SPACING_TY },
  prSm: { paddingRight: SPACING_SM },
  pr: { paddingRight: SPACING },
  prMd: { paddingRight: SPACING_MD },
  prLg: { paddingRight: SPACING_LG },

  pv0: { paddingVertical: 0 },
  pvMi: { marginVertical: SPACING_MI },
  pvTy: { paddingVertical: SPACING_TY },
  pvSm: { paddingVertical: SPACING_SM },
  pv: { paddingVertical: SPACING },
  pvMd: { paddingVertical: SPACING_MD },
  pvLg: { paddingVertical: SPACING_LG },

  ph0: { paddingHorizontal: 0 },
  phMi: { marginVertical: SPACING_MI },
  phTy: { paddingHorizontal: SPACING_TY },
  phSm: { paddingHorizontal: SPACING_SM },
  ph: { paddingHorizontal: SPACING },
  phMd: { paddingHorizontal: SPACING_MD },
  phLg: { paddingHorizontal: SPACING_LG }
})

export default spacings
