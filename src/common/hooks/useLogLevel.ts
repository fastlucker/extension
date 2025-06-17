import { useCallback, useState } from 'react'

// TODO: Dummy hook, wire it up to the background
export const useLogLevel = () => {
  const [isLogLevelEnabled, setIsLogLevelEnabled] = useState(false)

  const toggleLogLevel = useCallback(() => {
    setIsLogLevelEnabled((prev) => !prev)
  }, [])

  return {
    isLogLevelEnabled,
    toggleLogLevel
  }
}
