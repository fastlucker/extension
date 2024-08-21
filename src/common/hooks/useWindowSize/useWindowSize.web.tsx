import { useLayoutEffect, useState } from 'react'

import { breakpointsByWindowHeight, breakpointsByWindowWidth } from './breakpoints'
import { WindowSizeProps } from './types'

const useWindowSize = (): WindowSizeProps => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const updateWindowSize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useLayoutEffect(() => {
    updateWindowSize()

    const handleResize = () => updateWindowSize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
