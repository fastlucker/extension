import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  networkIconWrapper: ViewStyle
  networkIcon: ViewStyle
  loader: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
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
    loader: {
      position: 'absolute',
      margin: 'auto',
      width: '100%',
      height: '100%',
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      zIndex: 2,
      backgroundColor: theme.secondaryBackground
    }
  })

export default getStyles
