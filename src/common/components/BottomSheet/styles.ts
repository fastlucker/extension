import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import spacings, { DEVICE_HEIGHT, SPACING, SPACING_LG, SPACING_MD } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Style {
  root: ViewStyle
  bottomSheet: ViewStyle
  containerInnerWrapper: ViewStyle

  dragger: ViewStyle
  backDrop: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    root: {
      // Lower number than the toasts' zIndex
      zIndex: 900,
      elevation: 19
    },
    bottomSheet: {
      backgroundColor: theme.secondaryBackground,
      borderTopStartRadius: BORDER_RADIUS_PRIMARY,
      borderTopEndRadius: BORDER_RADIUS_PRIMARY,
      ...spacings.ptMd
    },
    containerInnerWrapper: {
      paddingBottom: SPACING_MD,
      paddingHorizontal: isWeb ? SPACING_LG : SPACING
    },
    dragger: {
      width: 60,
      height: 3,
      borderRadius: 4,
      backgroundColor: theme.secondaryBorder,
      top: 10
    },
    backDrop: {
      width: '100%',
      height: '100%',
      minHeight: DEVICE_HEIGHT,
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 899
    }
  })

export default getStyles
