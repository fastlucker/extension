import { MutableRefObject } from 'react'

import { ElementSizeProps } from './types'

// TODO:
const useElementSize = (ref: MutableRefObject<HTMLElement | null>): ElementSizeProps => {
  // TODO: impl for mobile
  const maxElementWidthSize = (size: number) => {
    return false
  }

  // TODO: impl for mobile
  const minElementWidthSize = (size: number) => {
    return false
  }

  return {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    maxElementWidthSize,
    minElementWidthSize
  }
}

export default useElementSize
