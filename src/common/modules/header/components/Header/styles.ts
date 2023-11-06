import { ImageStyle, Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import spacings, { SPACING } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

export const HEADER_HEIGHT = Platform.select({
  web: 40 + SPACING * 2,
  default: 60
})

interface Styles {
  container: ViewStyle
  containerInner: ViewStyle
  navIconContainerRegular: ViewStyle
  title: TextStyle
  sideContainer: ViewStyle
  // Account
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
    container: {
      zIndex: 9,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      ...spacings.ph,
      ...spacings.pt,
      ...spacings.pb,
      ...(isWeb ? { height: HEADER_HEIGHT } : {})
    },
    containerInner: {
      flexDirection: 'row',
      alignItems: 'center',
      ...commonWebStyles.contentContainer,
      flex: 1
    },
    navIconContainerRegular: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      textAlign: 'center',
      flex: 1,
      ...spacings.phTy
    },
    sideContainer: {
      width: isWeb ? 180 : 120,
      minWidth: isWeb ? 180 : 120
    },
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
