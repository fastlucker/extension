import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  withContainerStyle: ViewStyle
  networkIconWrapper: ViewStyle
  networkIcon: ViewStyle
  loader: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    withContainerStyle: {
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter
    },
    networkIconWrapper: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 3,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      borderRadius: 12
    },
    networkIcon: {
      backgroundColor: theme.primaryBackground
    },
    loader: { position: 'absolute', zIndex: 2 }
  })

export default getStyles
