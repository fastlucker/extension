import { useEffect, useState } from 'react'

interface Props<T> {
  value: T
  delay: number
}

function useDebounce<T>({ value, delay }: Props<T>): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
