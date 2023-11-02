import { ImageStyle, Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

export const HEADER_HEIGHT = Platform.select({
  web: 90,
  default: 60
})

interface Styles {
  container: ViewStyle
  containerInner: ViewStyle
  navIconContainerRegular: ViewStyle
  title: TextStyle
  sideContainer: ViewStyle
  // Account
  account: ViewStyle
  accountButton: ViewStyle
  accountButtonRightIcon: ViewStyle
  accountButtonInfo: ViewStyle
  accountButtonInfoIcon: ImageStyle
  accountButtonInfoText: TextStyle
  accountAddressAndLabel: ViewStyle
  accountCopyIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      zIndex: 9,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.secondaryBackground,
      ...spacings.ph4Xl,
      ...spacings.pv,
      ...(isWeb ? { height: 90 } : {})
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
      width: 120,
      minWidth: 120
    },
    // Account
    account: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    accountButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 40,
      ...spacings.phMi,
      backgroundColor: '#B6B9FF26',
      borderWidth: 1,
      borderColor: '#6770B333',
      borderRadius: 12,
      minWidth: 180
    },
    accountButtonRightIcon: { borderColor: 'transparent', borderRadius: 8 },
    accountButtonInfo: { ...flexbox.directionRow, ...flexbox.alignCenter },
    accountButtonInfoIcon: { width: 25, height: 25, borderRadius: 10 },
    accountButtonInfoText: { ...spacings.mlMi },
    accountAddressAndLabel: { ...flexbox.directionRow, ...flexbox.alignEnd, ...spacings.mhTy },
    accountCopyIcon: { backgroundColor: 'transparent', borderColor: 'transparent' }
  })

export default getStyles
