import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  tokenInfoAndIcon: ViewStyle
  tokenInfo: ViewStyle
  tokenSymbolAndNetwork: ViewStyle
  balance: ViewStyle
  networkIcon: ViewStyle
  actionsContainer: ViewStyle
  action: ViewStyle
  visibilityIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    tokenInfoAndIcon: {
      ...flexbox.directionRow,
      ...spacings.mb,
      ...flexbox.flex1,
      ...flexbox.alignCenter
    },
    tokenInfo: {
      ...spacings.plTy,
      ...flexbox.flex1
    },
    balance: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.wrap
    },
    networkIcon: {
      width: 20,
      height: 20,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 12
    },
    tokenSymbolAndNetwork: {
      ...flexbox.directionRow
    },
    actionsContainer: {
      ...spacings.ph,
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
      ...flexbox.justifyCenter,
      ...spacings.phMi,
      ...spacings.pvSm,
      ...common.borderRadiusPrimary
    },
    // @ts-ignore web style
    visibilityIcon: { ...spacings.phMi, cursor: 'pointer' }
  })

export default getStyles
