import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  inputContainer: ViewStyle
  inputBottom: ViewStyle
  doubleCheckMessage: TextStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: spacings.mb,
  inputBottom: spacings.mlTy,
  doubleCheckMessage: spacings.mbSm
})

export default styles
