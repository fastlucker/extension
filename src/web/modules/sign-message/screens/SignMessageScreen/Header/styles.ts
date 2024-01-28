import { StyleSheet, ViewStyle } from 'react-native'

import spacings, {
  IS_SCREEN_SIZE_DESKTOP_LARGE,
  SPACING_3XL,
  SPACING_XL
} from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  content: ViewStyle
  network: ViewStyle
  networkIcon: ViewStyle
  networkName: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      paddingHorizontal: IS_SCREEN_SIZE_DESKTOP_LARGE ? SPACING_3XL : SPACING_XL,
      ...spacings.pv,
      backgroundColor: theme.secondaryBackground,
      borderBottomColor: theme.secondaryBorder,
      borderBottomWidth: 1
    },
    content: { ...flexbox.directionRow, ...flexbox.alignCenter },
    network: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.mlTy
    },
    networkIcon: {
      width: 40,
      height: 40,
      ...common.borderRadiusPrimary,
      backgroundColor: theme.tertiaryBackground,
      ...spacings.mlTy
    },
    networkName: spacings.mrMi
  })

export default getStyles
