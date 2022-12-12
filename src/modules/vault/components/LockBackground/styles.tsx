import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'
import { HEADER_HEIGHT } from '@config/Router/Header/style'

interface Style {
  backgroundImgWrapper: ViewStyle
}

// Bump up the negative top part more than the header height,
// so that it bleeds out of the top part of the screen more.
const TOP_OFFSET = isWeb ? 30 : 85

const styles = StyleSheet.create<Style>({
  backgroundImgWrapper: {
    position: 'absolute',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    top: -(HEADER_HEIGHT + TOP_OFFSET),
    paddingLeft: 2,
    alignSelf: 'center'
  }
})

export default styles
