import { StyleSheet, ViewStyle } from 'react-native'

import { SPACING_4XL, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  pinExtension: ViewStyle
  videoBackground: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    pinExtension: {
      // @ts-ignore-next-line web only property
      position: 'fixed',
      right: SPACING_4XL + SPACING_XL,
      top: -SPACING_TY,
      zIndex: 10
    },
    videoBackground: {
      backgroundColor: theme.secondaryBackground,
      width: 640,
      height: 360,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...commonStyles.borderRadiusPrimary
    }
  })

export default getStyles
