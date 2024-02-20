import { MutableRefObject, useEffect, useState } from 'react'

const useElementSize = (ref: MutableRefObject<HTMLElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const updateElementSize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateElementSize()

    let resizeObserver: any = new ResizeObserver(updateElementSize)
    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current)
        resizeObserver = null
      }
    }
  }, [ref])

  const maxElementWidthSize = (size: number) => {
    return size <= dimensions.width
  }

  const minElementWidthSize = (size: number) => {
    return size > dimensions.width
  }

  return {
    ...dimensions,
    maxElementWidthSize,
    minElementWidthSize
  }
}

export default useElementSize
