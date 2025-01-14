import { useRef } from 'react'
import isEqual from 'react-fast-compare'

function useDeepMemo<T>(value: T, testId?: string): T {
  const ref = useRef(value)
  // logs for testing the performance
  // console.time(`${testId} Performance`)
  const areEqual = isEqual(ref.current, value)
  if (!areEqual) ref.current = value
  // console.timeEnd(`${testId} Performance`)

  return ref.current
}

export default useDeepMemo
