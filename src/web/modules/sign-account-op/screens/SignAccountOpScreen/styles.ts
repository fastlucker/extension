import { StyleSheet, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  transactionsContainer: ViewStyle
  transactionsHeading: ViewStyle
  transactionsScrollView: ViewStyle
  separator: ViewStyle
  estimationContainer: ViewStyle
  estimationHeading: ViewStyle
  spinner: ViewStyle
  accountSelect: ViewStyle
  accountSelectLabel: ViewStyle
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
  spinner: {
    alignSelf: 'center'
  },
  accountSelect: {
    ...spacings.mb
  },
  accountSelectLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MEDIUM,
    marginLeft: 12
  }
})

export default styles
