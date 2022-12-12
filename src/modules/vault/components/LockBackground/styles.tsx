import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { HEADER_HEIGHT } from '@config/Router/Header/style'
import { SPACING_LG } from '@modules/common/styles/spacings'

interface Style {
  backgroundImgWrapper: ViewStyle
  backgroundImg: ImageStyle
}

const styles = StyleSheet.create<Style>({
  backgroundImgWrapper: {
    position: 'absolute',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
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
