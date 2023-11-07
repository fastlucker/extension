import { Dimensions, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  contentContainer: ViewStyle
  sideContentContainer: ViewStyle
  informationCircle: ViewStyle
  footerContainer: ViewStyle
  primarySideItem: ViewStyle
  errorSideItem: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    contentContainer: {
      height: '100%',
      ...spacings.pbLg,
      ...spacings.ph0,
      ...flexbox.flex1
    },
    sideContentContainer: {
      ...spacings.ph0,
      ...spacings.plXl,
      maxWidth: 582,
      minWidth: 300,
      // TODO: this is a temp solution because Dimension gets the static sizes of the window and doesn't update dynamically
      width: Dimensions.get('window').width < 1300 ? 300 : '30%',
      overflow: 'hidden'
    },
    informationCircle: {
      ...flexbox.alignSelfCenter,
      ...spacings.pbLg
    },
    footerContainer: {
      maxHeight: 120,
      ...flexbox.flex1,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...flexbox.directionRow,
      ...spacings.ph3Xl,
      backgroundColor: theme.primaryBackground,
      shadowColor: '#B8BDE080',
      shadowOffset: {
        width: 0,
        height: -2
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 7
    },
    primarySideItem: {
      borderColor: theme.primaryLight,
      borderWidth: 1,
      backgroundColor: '#F6F0FF',
      ...common.borderRadiusPrimary,
      ...spacings.phXl,
      ...spacings.pvXl
    },
    errorSideItem: {
      borderColor: theme.errorDecorative,
      borderWidth: 1,
      backgroundColor: theme.errorBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phXl,
      ...spacings.pvXl
    }
  })

export default getStyles
