import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@modules/common/styles/spacings'

// Fill up all available space, excluding only the status bar and the header
// to determinate the status bar height (currently, with a magic number)
export const BOTTOM_SHEET_FULL_HEIGHT = DEVICE_HEIGHT - 100

interface Styles {
  containerWrapper: ViewStyle
  containerInnerWrapper: ViewStyle
  cancelBtn: ViewStyle
  dragger: ViewStyle
  backDrop: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  containerWrapper: {
    backgroundColor: colors.panelBackgroundColor,
    // Required in order for the wrapper to cover
    // the bottom bars and to extend all the way to full screen
    minHeight: BOTTOM_SHEET_FULL_HEIGHT,
    height: '100%'
  },
  containerInnerWrapper: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    height: '100%',
    flex: 1
  },
  cancelBtn: {
    alignSelf: 'center',
    marginTop: 15
  },
  dragger: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.tertiaryAccentColor,
    alignSelf: 'center',
    position: 'absolute',
    top: 8
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
