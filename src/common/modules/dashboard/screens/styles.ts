import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  container: ViewStyle
  contentContainer: ViewStyle
  overview: ViewStyle
  overviewLoader: ViewStyle
  networks: ViewStyle
  networkIconContainer: ViewStyle
  networkIconContainerHovered: ViewStyle
  networkIcon: ViewStyle
  accountButton: ViewStyle
  accountButtonRightIcon: ViewStyle
  accountButtonInfo: ViewStyle
  accountButtonInfoIcon: ImageStyle
  accountButtonInfoText: TextStyle
  accountAddressAndLabel: ViewStyle
  accountCopyIcon: ViewStyle
}

export const NEUTRAL_BACKGROUND = '#1418333D'
export const NEUTRAL_BACKGROUND_HOVERED = '#14183352'
export const DASHBOARD_OVERVIEW_BACKGROUND = '#353d6e'

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    contentContainer: commonWebStyles.contentContainer,
    container: {
      ...flexbox.flex1,
      backgroundColor: theme.primaryBackground
    },
    overview: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween
    },
    overviewLoader: {
      width: 150,
      height: 34,
      backgroundColor: theme.primaryBackground,
      ...spacings.mbTy,
      ...common.borderRadiusPrimary
    },
    networks: { ...flexbox.directionRow, ...flexbox.alignCenter },
    networkIconContainer: {
      borderRadius: 13,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      backgroundColor: theme.secondaryBackground,
      marginLeft: -SPACING_MI
    },
    networkIconContainerHovered: {
      backgroundColor: theme.primaryBackground,
      transform: [{ scale: 1.1 }]
    },
    networkIcon: {
      width: 18,
      height: 18
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
