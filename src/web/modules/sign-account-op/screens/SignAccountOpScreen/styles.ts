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
  pendingTokensSeparatorContainer: ViewStyle
  pendingTokensHeadingWrapper: ViewStyle
  pendingTokensScrollView: ViewStyle
  separator: ViewStyle
  estimationContainer: ViewStyle
  estimationHeading: ViewStyle
  spinner: ViewStyle
  accountSelect: ViewStyle
  accountSelectLabel: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.directionRow
    },
    leftSideContainer: {
      flexBasis: '60%'
    },
    transactionsContainer: {
      flex: 1.5
    },
    transactionsHeading: {
      marginBottom: 40
    },
    transactionsScrollView: {
      height: '100%',
      ...spacings.pr
    },
    pendingTokensContainer: {
      flex: 1
    },
    separatorHorizontal: {
      position: 'absolute',
      width: '100%',
      height: 1,
      backgroundColor: theme.tertiaryBorder
    },
    pendingTokensSeparatorContainer: {
      backgroundColor: theme.primaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
      ...spacings.pbTy,
      ...spacings.ptSm,
      ...spacings.mbTy,
      width: '100%'
    },
    pendingTokensHeadingWrapper: {
      backgroundColor: theme.primaryBackground,
      ...spacings.ph
    },
    pendingTokensScrollView: {
      height: '100%',
      ...spacings.pr
    },
    separator: {
      width: 1,
      backgroundColor: theme.tertiaryBorder,
      ...spacings.mr3Xl,
      ...spacings.ml2Xl
    },
    estimationContainer: {
      ...flexbox.flex1
    },
    estimationHeading: {
      ...spacings.mbLg
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

export default getStyles
