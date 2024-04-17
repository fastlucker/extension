import { MutableRefObject, useEffect, useState } from 'react'

const useElementSize = (ref: MutableRefObject<HTMLElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateElementSize = () => {
      if (ref.current) {
        const { width, height, x, y } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
        setPosition({ x, y })
      }
    }

    updateElementSize()

    let resizeObserver: any = new ResizeObserver(updateElementSize)
    if (ref.current) {
      resizeObserver.observe(ref.current)
      window.addEventListener('resize', updateElementSize)
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current)
        resizeObserver = null
        window.removeEventListener('resize', updateElementSize)
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
    ...position,
    maxElementWidthSize,
    minElementWidthSize
  }
}

export default useElementSize
