import { StyleSheet, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  leftSideContainer: ViewStyle
  transactionsContainer: ViewStyle
  transactionsHeading: ViewStyle
  transactionsScrollView: ViewStyle
  pendingTokensContainer: ViewStyle
  separatorHorizontal: ViewStyle
  pendingTokensHeadingWrapper: ViewStyle
  pendingTokensScrollView: ViewStyle
  separator: ViewStyle
  estimationContainer: ViewStyle
  estimationHeading: ViewStyle
  accountSelect: ViewStyle
  accountSelectLabel: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.flex1,
    ...flexbox.directionRow
  },
  leftSideContainer: {
    flexBasis: '60%'
  },
  transactionsContainer: {
    flex: 1
  },
  transactionsHeading: {
    marginBottom: 40
  },
  transactionsScrollView: {
    height: '100%',
    paddingRight: 22
  },
  pendingTokensContainer: {
    flex: 1
  },
  separatorHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'visible',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 40
  },
  pendingTokensHeadingWrapper: {
    backgroundColor: colors.white,
    ...spacings.ph
  },
  pendingTokensScrollView: {
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
  }
})

export default styles
