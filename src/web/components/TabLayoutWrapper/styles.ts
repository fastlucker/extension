import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { THEME_TYPES, ThemeProps, ThemeType } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  contentContainer: ViewStyle
  informationCircle: ViewStyle
  footerContainer: ViewStyle
  footer: ViewStyle
}

const getStyles = (theme: ThemeProps, themeType: ThemeType) =>
  StyleSheet.create<Style>({
    contentContainer: {
      height: '100%',
      ...spacings.pbMd,
      ...spacings.ph0,
      ...spacings.mtMd,
      ...flexbox.flex1
    },
    informationCircle: {
      ...flexbox.alignSelfCenter,
      ...spacings.pbLg
    },
    footerContainer: {
      ...flexbox.flex1,
      maxHeight: 80,
      ...spacings.ph3Xl,
      backgroundColor:
        themeType === THEME_TYPES.DARK ? theme.secondaryBackground : theme.primaryBackground,
      shadowColor: '#B8BDE080',
      shadowOffset: {
        width: 0,
        height: -2
      },
      shadowOpacity: themeType === THEME_TYPES.DARK ? 0 : 1,
      shadowRadius: 4,
      elevation: 7
    },
    footer: {
      ...flexbox.flex1,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...flexbox.directionRow,
      width: '100%',
      marginHorizontal: 'auto'
    }
  })

export default getStyles
