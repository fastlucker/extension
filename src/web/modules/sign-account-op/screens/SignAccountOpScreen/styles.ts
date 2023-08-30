import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import flexbox from '@common/styles/utils/flexbox'
import spacings from '@common/styles/spacings'

interface Style {
  container: ViewStyle
  transactionsContainer: ViewStyle
  transactionsHeading: ViewStyle
  transactionsScrollView: ViewStyle
  separator: ViewStyle
  estimationContainer: ViewStyle
  estimationHeading: ViewStyle
  accountSelect: ViewStyle
  accountSelectLabel: ViewStyle
  tokenSelect: ViewStyle
  tokenSelectLabel: ViewStyle
  transactionSpeedContainer: ViewStyle
  transactionSpeedLabel: TextStyle
  feesContainer: ViewStyle
  feeContainer: ViewStyle
  fee: TextStyle
  feeUsd: TextStyle
  gasTankContainer: ViewStyle
  gasTankText: TextStyle
  // @TODO - once we update react-native to 0.71, then we will have `gap` support and can remove this helper class
  mr10: {}
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.flex1,
    ...flexbox.directionRow
  },
  transactionsContainer: {
    flexBasis: '60%',
    height: '100%'
  },
  transactionsHeading: {
    marginBottom: 40
  },
  transactionsScrollView: {
    height: '100%',
    paddingRight: 22
  },
  separator: {
    width: 1,
    marginHorizontal: 35,
    backgroundColor: colors.chetwode_50
  },
  estimationContainer: {
    ...flexbox.flex1
  },
  estimationHeading: {
    marginBottom: 20
  },
  accountSelect: {
    ...spacings.mb
  },
  accountSelectLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MEDIUM,
    marginLeft: 12
  },
  tokenSelect: {
    marginBottom: 28
  },
  tokenSelectLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MEDIUM,
    marginLeft: 12
  },
  transactionSpeedContainer: {
    marginBottom: 34
  },
  transactionSpeedLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MEDIUM,
    marginLeft: 12,
    marginBottom: 10
  },
  feesContainer: {
    ...flexbox.directionRow
  },
  feeContainer: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween
  },
  fee: {
    fontFamily: FONT_FAMILIES.MEDIUM,
    fontSize: 16
  },
  feeUsd: {
    color: colors.violet,
    fontSize: 16
  },
  gasTankContainer: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween
  },
  gasTankText: {
    color: colors.greenHaze,
    fontSize: 14
  },
  mr10: {
    marginRight: 10
  }
})

export default styles
