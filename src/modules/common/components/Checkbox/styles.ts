import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  container: ViewStyle
  checkboxWrapper: ViewStyle
  checkbox: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    ...spacings.mb
  },
  checkboxWrapper: {
    // Because the rn-checkbox can't get smaller than 20
    //  it should be scaled down to ~18
    transform: [{ scale: 0.9 }],
    ...spacings.mrTy
  },
  checkbox: {
    width: 20,
    height: 20
  }
})

export default styles
