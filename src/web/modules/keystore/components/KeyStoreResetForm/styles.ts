import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Styles {
  passwordInput: ViewStyle
  confirmPasswordInput: ViewStyle
  checkbox: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  passwordInput: spacings.mbTy,
  confirmPasswordInput: spacings.mb,
  checkbox: spacings.mbMd
})

export default styles
