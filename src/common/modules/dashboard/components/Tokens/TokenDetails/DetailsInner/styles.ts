import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

const buttonStyle = {
  flex: 1,
  marginBottom: 0
}

interface Style {
  closeIcon: ViewStyle
  tokenInfoAndIcon: ViewStyle
  tokenInfo: ViewStyle
  tokenSymbolAndNetwork: ViewStyle
  balance: ViewStyle
  network: ViewStyle
  networkIcon: ViewStyle
  buttons: ViewStyle
  button: ViewStyle
  emptyButton: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    closeIcon: { position: 'absolute', zIndex: 1, right: 0, top: 0 },
    tokenInfoAndIcon: { ...flexbox.directionRow, ...spacings.mb3Xl },
    tokenInfo: { ...spacings.mlSm },
    balance: { ...flexbox.directionRow },
    network: { ...flexbox.directionRow, ...flexbox.alignCenter, ...spacings.mlSm },
    networkIcon: {
      width: 18,
      height: 18,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 12
    },
    tokenSymbolAndNetwork: { ...flexbox.directionRow },
    buttons: { ...flexbox.directionRow },
    button: buttonStyle,
    emptyButton: {
      ...buttonStyle,
      opacity: 0,
      backgroundColor: 'transparent',
      borderColor: 'transparent'
    }
  })

export default getStyles
