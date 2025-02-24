import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useExtraEntropy = () => {
  const getExtraEntropy = useCallback(() => {
    // TODO: steps to add support for the mobile app:
    // 1. install the polyfill: `yarn add react-native-performance`
    // 2. add it globally in a top-level file:
    // if (typeof performance === "undefined") {
    //   global.performance = { now }
    // }
    const extraEntropy = `${uuidv4()}-${performance.now()}`

    return extraEntropy
  }, [])

  return {
    getExtraEntropy
  }
}

export default useExtraEntropy
