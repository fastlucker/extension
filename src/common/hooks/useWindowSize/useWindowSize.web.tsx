import { useCallback, useEffect, useState } from 'react'

import { breakpointsByWindowHeight, breakpointsByWindowWidth } from './breakpoints'
import { WindowSizeProps } from './types'

const useWindowSize = (): WindowSizeProps => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const updateWindowSize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  useEffect(() => {
    updateWindowSize()

    window.addEventListener('resize', updateWindowSize)

    return () => {
      window.removeEventListener('resize', updateWindowSize)
    }
  }, [updateWindowSize])

  const maxWidthSize: WindowSizeProps['maxWidthSize'] = (size) => {
    if (typeof size === 'number') {
      return size <= dimensions.width
    }

    return breakpointsByWindowWidth[size] <= dimensions.width
  }

  const minWidthSize: WindowSizeProps['minWidthSize'] = (size) => {
    if (typeof size === 'number') {
      return size > dimensions.width
    }

    return breakpointsByWindowWidth[size] > dimensions.width
  }

  const minHeightSize: WindowSizeProps['minHeightSize'] = (size) => {
    if (typeof size === 'number') {
      return size > dimensions.height
    }

    return breakpointsByWindowHeight[size] > dimensions.height
  }

  return {
    ...dimensions,
    minWidthSize,
    maxWidthSize,
    minHeightSize
  }
}

export default useWindowSize
