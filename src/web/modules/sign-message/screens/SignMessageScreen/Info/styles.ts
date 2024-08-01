import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  image: ImageStyle
  content: ViewStyle
  kindOfMessage: ViewStyle
  kindOfMessageText: TextStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: { ...flexbox.alignCenter, width: '100%' },
    image: { width: 50, height: 50, ...spacings.mbSm },
    content: {
      ...flexbox.directionRow,
      ...flexbox.justifyCenter,
      width: '100%',
      ...flexbox.alignCenter,
      position: 'relative'
    },
    kindOfMessage: {
      backgroundColor: theme.infoBackground,
      borderColor: theme.infoDecorative,
      borderWidth: 1,
      borderRadius: 24,
      width: 'auto',
      height: 24,
      ...flexbox.justifyCenter,
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.pl,
      ...spacings.prMi
    },
    kindOfMessageText: spacings.mr
  })

export default getStyles
