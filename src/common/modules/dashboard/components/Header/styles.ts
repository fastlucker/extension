import { ImageStyle, Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

export const HEADER_HEIGHT = Platform.select({
  web: 40 + SPACING * 2,
  default: 60
})

interface Styles {
  accountButton: ViewStyle
  accountButtonRightIcon: ViewStyle
  accountButtonInfo: ViewStyle
  accountButtonInfoIcon: ImageStyle
  accountButtonInfoText: TextStyle
  accountAddressAndLabel: ViewStyle
  accountCopyIcon: ViewStyle
  maximizeAndMenu: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    // Account
    accountButton: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      height: 40,
      maxWidth: 412,
      ...spacings.phMi,
      backgroundColor: theme.secondaryBackground,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      ...common.borderRadiusPrimary,
      ...flexbox.flex1
    },
    accountButtonRightIcon: { borderColor: 'transparent', ...common.borderRadiusPrimary },
    accountButtonInfo: { ...flexbox.directionRow, ...flexbox.alignCenter },
    accountButtonInfoIcon: { width: 32, height: 32, ...common.borderRadiusPrimary },
    accountButtonInfoText: { ...spacings.mlMi },
    accountAddressAndLabel: { ...flexbox.directionRow, ...flexbox.alignEnd, ...spacings.mlTy },
    accountCopyIcon: { backgroundColor: 'transparent', borderColor: 'transparent' },
    maximizeAndMenu: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.mlLg
    }
  })

export default getStyles
