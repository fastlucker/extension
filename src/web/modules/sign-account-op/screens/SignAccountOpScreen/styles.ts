import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  leftSideContainer: ViewStyle
  transactionsContainer: ViewStyle
  transactionsScrollView: ViewStyle
  separatorHorizontal: ViewStyle
  simulationSection: ViewStyle
  simulationScrollView: ViewStyle
  simulationContainer: ViewStyle
  simulationContainerHeader: ViewStyle
  separator: ViewStyle
  estimationContainer: ViewStyle
  estimationScrollView: ViewStyle
  estimationHeading: ViewStyle
  spinner: ViewStyle
  accountSelect: ViewStyle
  errorContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.directionRow
    },
    leftSideContainer: {
      flexBasis: '60%',
      justifyContent: 'flex-start',
      height: '100%'
    },
    transactionsContainer: {
      flex: 1,
      maxHeight: '50%'
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
    simulationSection: {
      ...spacings.mbXl,
      maxHeight: '50%'
    },
    simulationScrollView: {
      ...spacings.pr,
      ...spacings.phSm,
      ...spacings.pvSm
    },
    simulationContainer: {
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      borderColor: theme.secondaryBorder,
      overflow: 'hidden',
      ...flexbox.flex1,
      maxHeight: '100%'
    },
    simulationContainerHeader: {
      backgroundColor: theme.secondaryBackground,
      ...spacings.phTy,
      ...spacings.pvMi
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
    estimationScrollView: {
      height: '100%',
      ...spacings.pr
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
    errorContainer: {
      marginTop: 'auto',
      paddingTop: 10
    }
  })

export default getStyles
