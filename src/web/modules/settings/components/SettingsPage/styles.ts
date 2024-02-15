import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'

interface Style {
  background: ViewStyle
  container: ViewStyle
  panel: ViewStyle
  fullWidth: ViewStyle
  sideContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    background: {
      ...flexbox.alignCenter,
      ...flexbox.flex1,
      backgroundColor: theme.secondaryBackground
    },
    container: {
      ...flexbox.directionRow,
      ...flexbox.flex1,
      ...spacings.ptSm
    },
    panel: {
      ...spacings.mhXl,
      ...flexbox.flex1,
      width: TAB_CONTENT_WIDTH
    },
    fullWidth: {
      width: '100%'
    },
    sideContainer: {
      opacity: 0,
      // @ts-ignore
      pointerEvents: 'none'
    }
  })

export default getStyles
