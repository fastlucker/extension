import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { THEME_TYPES, ThemeProps, ThemeType } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  dappInfoContainer: ViewStyle
  dappInfoContent: ViewStyle
  separator: ViewStyle
  boxWrapper: ViewStyle
}

const getStyles = (theme: ThemeProps, themeType: ThemeType) =>
  StyleSheet.create<Style>({
    dappInfoContainer: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.mbMd
    },
    dappInfoContent: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.phMd,
      ...flexbox.flex1
    },
    separator: {
      width: 1,
      maxWidth: 1,
      flex: 1,
      marginHorizontal: 10
    },
    boxWrapper: {
      ...spacings.pvMd,
      ...spacings.phMd,
      ...common.borderRadiusPrimary,
      ...(themeType === THEME_TYPES.DARK ? common.shadowTertiaryDarkMode : common.shadowTertiary),
      backgroundColor:
        themeType === THEME_TYPES.DARK ? theme.secondaryBackground : theme.primaryBackground,
      width: 421,
      height: 343
    }
  })

export default getStyles
