import { Dimensions } from 'react-native'

import { breakpointsByWindowHeight, breakpointsByWindowWidth } from './breakpoints'
import { WindowSizeProps } from './types'

const useWindowSize = (): WindowSizeProps => {
  const maxWidthSize: WindowSizeProps['maxWidthSize'] = (size) => {
    if (typeof size === 'number') {
      return size <= Dimensions.get('window').width
    }

    return breakpointsByWindowWidth[size] <= Dimensions.get('window').width
  }

  const minWidthSize: WindowSizeProps['minWidthSize'] = (size) => {
    if (typeof size === 'number') {
      return size > Dimensions.get('window').width
    }

    return breakpointsByWindowWidth[size] > Dimensions.get('window').width
  }

  const minHeightSize: WindowSizeProps['minHeightSize'] = (size) => {
    if (typeof size === 'number') {
      return size > Dimensions.get('window').height
    }

    return breakpointsByWindowHeight[size] > Dimensions.get('window').height
  }

  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    minWidthSize,
    maxWidthSize,
    minHeightSize
  }
}

export default useWindowSize
