import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_MI, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  gif: ImageStyle
  contentContainer: ViewStyle
  bullet: ViewStyle
  activeBullet: ViewStyle
  hoveredBullet: ViewStyle
}

export const STORY_CARD_WIDTH = 488

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      width: STORY_CARD_WIDTH,
      height: 600,
      backgroundColor: theme.secondaryBackground,
      ...flexbox.alignCenter,
      ...common.borderRadiusPrimary,
      shadowColor: '#14183333',
      shadowOpacity: 1,
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 16,
      marginHorizontal: 'auto',
      overflow: 'hidden'
    },
    gif: {
      height: 318,
      width: '100%'
    },
    contentContainer: {
      paddingTop: SPACING_XL + SPACING_TY,
      paddingBottom: SPACING_XL + SPACING_MI,
      ...spacings.phXl,
      backgroundColor: theme.primaryBackground,
      ...flexbox.flex1
    },
    bullet: {
      width: 16,
      height: 16,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.primary,
      ...spacings.mrTy
    },
    activeBullet: {
      backgroundColor: theme.primary
    },
    hoveredBullet: {
      backgroundColor: theme.infoBackground
    }
  })

export default getStyles
