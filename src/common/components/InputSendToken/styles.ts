import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  // MaxAmount
  maxAmount: ViewStyle
  maxAmountLabel: TextStyle
  maxAmountValueWrapper: ViewStyle
  maxAmountValue: TextStyle
  // Input
  inputWrapper: ViewStyle
  inputContainerStyle: ViewStyle
}

const styles = StyleSheet.create<Style>({
  maxAmount: {
    ...flexbox.directionRow,
    ...spacings.mbMi
  },
  maxAmountLabel: {
    ...spacings.mr
  },
  maxAmountValueWrapper: {
    ...flexbox.directionRow,
    ...flexbox.flex1
  },
  maxAmountValue: { ...flexbox.flex1, textAlign: 'right' },
  inputWrapper: {
    ...flexbox.directionRow,
    ...spacings.mbSm
  },
  inputContainerStyle: {
    ...spacings.mbTy,
    ...flexbox.flex1
  }
})

export default styles
