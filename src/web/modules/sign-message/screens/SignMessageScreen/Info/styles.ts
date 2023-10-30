import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
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
    container: { ...flexbox.alignCenter, width: '100%', ...spacings.mb2Xl },
    image: { width: 50, height: 50, ...spacings.mbSm },
    content: {
      ...flexbox.directionRow,
      ...flexbox.justifyCenter,
      width: '100%',
      ...flexbox.alignCenter,
      position: 'relative',
      ...spacings.mb
    },
    kindOfMessage: {
      backgroundColor: theme.infoBackground,
      borderColor: theme.infoDecorative,
      borderWidth: 1,
      borderRadius: 24,
      width: 'auto',
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.plLg,
      ...spacings.prMi,
      paddingVertical: SPACING_MI / 2,
      marginLeft: 'auto',
      position: 'absolute',
      right: 0,
      bottom: -(SPACING_MI / 2)
    },
    kindOfMessageText: spacings.mr
  })

export default getStyles
