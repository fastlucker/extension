import { Dimensions } from 'react-native'

import { breakpointsByWindowWidth } from './breakpoints'
import { WindowSizeProps } from './types'

const useWindowSize = (): WindowSizeProps => {
  const maxWidthSize = (size: keyof typeof breakpointsByWindowWidth) => {
    return breakpointsByWindowWidth[size] <= Dimensions.get('window').width
  }

  const minWidthSize = (size: keyof typeof breakpointsByWindowWidth) => {
    return breakpointsByWindowWidth[size] > Dimensions.get('window').height
  }

  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    minWidthSize,
    maxWidthSize
  }
}

export default useWindowSize
