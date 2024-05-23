import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  dappInfoContainer: ViewStyle
  dappInfoContent: ViewStyle
  separator: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    dappInfoContainer: { ...flexbox.alignCenter, width: '100%', ...spacings.mbLg },
    dappInfoContent: {
      ...flexbox.directionRow,
      ...flexbox.justifyCenter,
      width: '100%',
      ...flexbox.alignCenter,
      position: 'relative',
      ...spacings.mb
    },
    separator: {
      width: 1,
      maxWidth: 1,
      flex: 1,
      backgroundColor: theme.secondaryBorder
    }
  })

export default getStyles
