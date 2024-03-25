import { MutableRefObject } from 'react'

import { WindowSizeProps } from './types'

// TODO:
const useElementSize = (ref: MutableRefObject<HTMLElement | null>): WindowSizeProps => {
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
    maxElementWidthSize,
    minElementWidthSize
  }
}

export default useElementSize
