import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { HEADER_HEIGHT } from '@config/Router/Header/style'
import { DEVICE_WIDTH, SPACING_LG } from '@modules/common/styles/spacings'

interface Style {
  backgroundImgWrapper: ViewStyle
  backgroundImg: ImageStyle
}

const styles = StyleSheet.create<Style>({
  backgroundImgWrapper: {
    width: DEVICE_WIDTH + SPACING_LG,
    position: 'absolute',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -5,
    top: -(HEADER_HEIGHT + SPACING_LG),
    paddingLeft: 2,
    alignSelf: 'center'
  },
  backgroundImg: {
    width: '100%',
    height: '100%'
  }
})

export default styles
