import { StyleSheet, ViewStyle } from 'react-native'

import { HEADER_HEIGHT } from '@config/Router/Header/style'

interface Style {
  backgroundImgWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  backgroundImgWrapper: {
    position: 'absolute',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    // Bump up the negative top part more than the header height,
    // so that it bleeds out of the top part of the screen more.
    top: -(HEADER_HEIGHT + 85),
    paddingLeft: 2,
    alignSelf: 'center'
  }
})

export default styles
