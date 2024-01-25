import { useLayoutEffect, useState } from 'react'

import { breakpointsByWindowWidth } from './breakpoints'
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

  const maxWidthSize = (size: keyof typeof breakpointsByWindowWidth) => {
    return breakpointsByWindowWidth[size] <= dimensions.width
  }

  const minWidthSize = (size: keyof typeof breakpointsByWindowWidth) => {
    return breakpointsByWindowWidth[size] > dimensions.width
  }

  return {
    ...dimensions,
    minWidthSize,
    maxWidthSize
  }
}

export default useWindowSize
