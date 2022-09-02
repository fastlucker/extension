import { useEffect, useRef } from 'react'

const useWebOnScroll = ({ onScroll, onScrollEnd }) => {
  const lastScrollEvent = useRef(null)
  const scrollEndTimeout = useRef(null)

  const handleWebScroll = (event) => {
    !!onScroll && onScroll(event)

    const timestamp = Date.now()

    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current)
    }

    if (lastScrollEvent.current) {
      // Scroll ended
      scrollEndTimeout.current = setTimeout(() => {
        if (lastScrollEvent.current === timestamp) {
          lastScrollEvent.current = null
          !!onScrollEnd && onScrollEnd(event)
        }
      }, 450)
    }

    lastScrollEvent.current = timestamp
  }

  useEffect(() => {
    return () => {
      scrollEndTimeout.current && clearTimeout(scrollEndTimeout.current)
    }
  }, [])

  return handleWebScroll
}

export default useWebOnScroll
