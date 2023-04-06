import { StyleSheet } from 'react-native'

import spacings, { DEVICE_WIDTH } from '@common/styles/spacings'

const cameraSideMaxLength = DEVICE_WIDTH - 90

const styles = StyleSheet.create({
  cameraWrapper: {
    borderRadius: 13,
    width: cameraSideMaxLength,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...spacings.mb
  },
  borderTopLeft: {
    position: 'absolute',
    zIndex: 5,
    top: 0,
    left: 0
  },
  borderBottomLeft: {
    position: 'absolute',
    zIndex: 5,
    bottom: 0,
    left: 0
  },
  borderTopRight: {
    position: 'absolute',
    zIndex: 5,
    right: 0,
    top: 0
  },
  borderBottomRight: {
    position: 'absolute',
    zIndex: 5,
    right: 0,
    bottom: 0
  },
  animation: {
    zIndex: 5
  }
})

export default styles
