import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  closeIcon: ViewStyle
  tokenInfoAndIcon: ViewStyle
  tokenInfo: ViewStyle
  tokenSymbolAndNetwork: ViewStyle
  balance: ViewStyle
  network: ViewStyle
  networkIcon: ViewStyle
  actionsContainer: ViewStyle
  action: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    closeIcon: { position: 'absolute', zIndex: 1, right: 0, top: 0 },
    tokenInfoAndIcon: { ...flexbox.directionRow, ...spacings.mb },
    tokenInfo: { ...spacings.mlSm },
    balance: { ...flexbox.directionRow },
    network: { ...flexbox.directionRow, ...flexbox.alignCenter, ...spacings.mlSm },
    networkIcon: {
      width: 20,
      height: 20,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 12
    },
    tokenSymbolAndNetwork: { ...flexbox.directionRow },
    actionsContainer: {
      ...spacings.phLg,
      ...spacings.pv,
      backgroundColor: theme.primaryBackground,
      ...common.borderRadiusPrimary,
      ...flexbox.directionRow,
      ...flexbox.wrap
    },
    action: {
      width: '25%',
      maxWidth: '25%',
      ...flexbox.alignCenter,
      ...spacings.phSm,
      ...spacings.pvSm,
      ...common.borderRadiusPrimary
    }
  })

export default getStyles
