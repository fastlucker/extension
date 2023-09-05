import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import colors from '@common/styles/colors'
import spacings, { SPACING_LG } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  view: ViewStyle
  hoveredBackground: ViewStyle
  image: ImageStyle
  text: TextStyle
  button: ViewStyle
  hoveredContent: ViewStyle
}

const styles = StyleSheet.create<Style>({
  view: flexbox.flex1,
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  hoveredContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...spacings.pv,
    ...spacings.pvTy,
    ...spacings.phTy,
    ...flexbox.justifySpaceBetween,
    zIndex: 3
  },
  text: {
    textAlign: 'center'
  },
  hoveredBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    opacity: 0.78,
    zIndex: 1
  },
  button: flexbox.directionRow
})

export default styles
