import isEqual from 'lodash/isEqual'
import { useRef } from 'react'

function useDeepMemo(value: any) {
  const ref = useRef(value)
  // logs for testing the performance
  // console.time('useDeepMemo Performance')
  const areEqual = isEqual(ref.current, value)
  if (!areEqual) ref.current = value
  // console.timeEnd('useDeepMemo Performance')

  return ref.current
}

export default useDeepMemo
