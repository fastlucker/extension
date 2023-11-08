import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  leftSideContainer: ViewStyle
  transactionsContainer: ViewStyle
  transactionsScrollView: ViewStyle
  separatorHorizontal: ViewStyle
  pendingTokensSeparatorContainer: ViewStyle
  pendingTokensHeadingWrapper: ViewStyle
  pendingTokensScrollView: ViewStyle
  separator: ViewStyle
  estimationContainer: ViewStyle
  estimationHeading: ViewStyle
  spinner: ViewStyle
  accountSelect: ViewStyle
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
    transactionsScrollView: {
      height: '100%',
      ...spacings.pr
    },
    separatorHorizontal: {
      position: 'absolute',
      width: '100%',
      height: 1,
      backgroundColor: theme.secondaryBorder
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
      backgroundColor: theme.secondaryBorder,
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
    }
  })

export default getStyles
