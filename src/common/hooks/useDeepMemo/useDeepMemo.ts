import { useRef } from 'react'
import isEqual from 'react-fast-compare'

function useDeepMemo(value: any, testId?: string) {
  const ref = useRef(value)
  // logs for testing the performance
  // console.time(`${testId} Performance`)
  const areEqual = isEqual(ref.current, value)
  if (!areEqual) ref.current = value
  // console.timeEnd(`${testId} Performance`)

  return ref.current
}

export default useDeepMemo
