import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import { DEVICE_HEIGHT } from '@modules/common/styles/spacings'

interface Styles {
  root: ViewStyle
  bottomSheet: ViewStyle
  containerInnerWrapper: ViewStyle
  closeBtn: ViewStyle
  cancelBtn: ViewStyle
  dragger: ViewStyle
  backDrop: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  root: {
    // Lower number that the toasts' zIndex
    zIndex: 900
  },
  bottomSheet: {
    backgroundColor: colors.clay,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    paddingTop: 23
  },
  containerInnerWrapper: {
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
    top: 10
  },
  backDrop: {
    width: '100%',
    height: '100%',
    minHeight: DEVICE_HEIGHT,
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1
  }
})

export default styles
