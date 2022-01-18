import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  amountContainer: ViewStyle
  amountValue: ViewStyle
}

const styles = StyleSheet.create<Style>({
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...spacings.mbTy
  },
  amountValue: {
    opacity: 0.8,
    flex: 1,
    textAlign: 'right',
    marginLeft: 5
  }
})

export default styles
