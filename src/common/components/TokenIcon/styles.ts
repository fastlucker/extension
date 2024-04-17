import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  loader: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      backgroundColor: colors.titan_05,
      overflow: 'hidden',
      ...common.borderRadiusPrimary,
      ...flexbox.center
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
