import { useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

interface Props {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => any
  onScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => any
}

type ReturnType = (event: NativeSyntheticEvent<NativeScrollEvent>) => void

const useWebOnScroll = ({ onScroll, onScrollEnd }: Props): ReturnType => {
  const lastScrollEvent = useRef<null | number>(null)
  const scrollEndTimeout = useRef<any>(null)

  const handleWebScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll(event)

    const timestamp = Date.now()

    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current)
    }

    if (lastScrollEvent.current) {
      // Scroll ended
      scrollEndTimeout.current = setTimeout(() => {
        if (lastScrollEvent.current === timestamp) {
          lastScrollEvent.current = null
          onScrollEnd(event)
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
