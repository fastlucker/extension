import { Dimensions } from 'react-native'

import { breakpointsByWindowWidth } from './breakpoints'
import { WindowSizeProps } from './types'

const useWindowSize = (): WindowSizeProps => {
  const maxWidthSize = (size: number | keyof typeof breakpointsByWindowWidth) => {
    if (typeof size === 'number') {
      return size <= Dimensions.get('window').width
    }

    return breakpointsByWindowWidth[size] <= Dimensions.get('window').width
  }

  const minWidthSize = (size: number | keyof typeof breakpointsByWindowWidth) => {
    if (typeof size === 'number') {
      return size > Dimensions.get('window').width
    }

    return breakpointsByWindowWidth[size] > Dimensions.get('window').width
  }

  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    minWidthSize,
    maxWidthSize
  }
}

export default useWindowSize
