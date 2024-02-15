import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_4XL, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  pinExtension: ViewStyle
  missedRewardsImg: ImageStyle
  tokensImg: ImageStyle
  confettiAnimationContainer: ViewStyle
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
    missedRewardsImg: {
      height: 220,
      width: 106,
      ...flexbox.alignSelfCenter,
      ...spacings.mb2Xl
    },
    tokensImg: {
      height: 165,
      width: 148,
      ...flexbox.alignSelfCenter,
      ...spacings.mb2Xl
    },
    confettiAnimationContainer: {
      position: 'absolute',
      zIndex: 1,
      top: -200,
      alignSelf: 'center'
    }
  })

export default getStyles
