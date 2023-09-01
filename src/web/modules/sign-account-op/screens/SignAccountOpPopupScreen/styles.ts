import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  containerInner: ViewStyle
  // Transactions
  transactionsHeading: TextStyle
  transactions: ViewStyle
  transaction: ViewStyle
  // Footer
  button: ViewStyle
  rejectButton: ViewStyle
  footer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: { ...flexbox.flex1 },
  containerInner: { ...flexbox.flex1, ...spacings.pv, ...spacings.ph },
  // Transactions
  transactionsHeading: { ...spacings.mlTy, ...spacings.mbMi },
  transactions: { ...spacings.mbMi },
  transaction: { ...spacings.mbTy },
  // Footer
  button: {
    ...spacings.phSm,
    width: 210
  },
  rejectButton: {
    backgroundColor: colors.melrose_15,
    ...spacings.mrSm
  },
  footer: {
    ...flexbox.directionRow,
    ...flexbox.justifyCenter,
    backgroundColor: colors.zircon,
    ...spacings.pvMd
  }
})

export default styles
