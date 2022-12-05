import { ImageStyle, StyleSheet } from 'react-native'

import { HEADER_HEIGHT } from '@config/Router/Header/style'
import { DEVICE_WIDTH, SPACING_LG } from '@modules/common/styles/spacings'

interface Style {
  backgroundImg: ImageStyle
}

const styles = StyleSheet.create<Style>({
  backgroundImg: {
    width: DEVICE_WIDTH,
    aspectRatio: 1,
    position: 'absolute',
    zIndex: -5,
    top: -(HEADER_HEIGHT + SPACING_LG),
    alignSelf: 'center'
  }
})

export default styles
