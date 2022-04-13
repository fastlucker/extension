import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@modules/common/styles/spacings'

export const BOTTOM_SHEET_FULL_HEIGHT = DEVICE_HEIGHT * 0.8

interface Styles {
  containerWrapper: ViewStyle
  containerInnerWrapper: ViewStyle
  closeBtn: ViewStyle
  cancelBtn: ViewStyle
  dragger: ViewStyle
  backDrop: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  containerWrapper: {
    backgroundColor: colors.valhalla,
    // Required in order for the wrapper to cover
    // the bottom bars and to extend all the way to full screen
    minHeight: BOTTOM_SHEET_FULL_HEIGHT
  },
  containerInnerWrapper: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 20
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 2
  },
  cancelBtn: {
    alignSelf: 'center',
    marginTop: 15
  },
  dragger: {
    width: 50,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.titan,
    alignSelf: 'center',
    position: 'absolute',
    top: 10
  },
  backDrop: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1
  }
})

export default styles
