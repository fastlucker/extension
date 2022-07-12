import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@modules/common/styles/spacings'

interface Styles {
  bottomSheet: ViewStyle
  containerInnerWrapper: ViewStyle
  closeBtn: ViewStyle
  cancelBtn: ViewStyle
  dragger: ViewStyle
  backDrop: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  bottomSheet: {
    backgroundColor: colors.clay,
    borderRadius: 15
  },
  containerInnerWrapper: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flex: 1
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
    height: 3,
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
