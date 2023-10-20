import { useEffect, useState } from 'react'

interface Props {
  value: string | number
  delay: number
}

const useDebounce = ({ value, delay }: Props) => {
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
