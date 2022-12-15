import { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const useUnlockWithBiometrics = ({
  shouldLockWhenInactive,
  lock,
  promptToUnlock
}: {
  shouldLockWhenInactive: boolean
  lock: () => void
  promptToUnlock: () => Promise<any>
}) => {
  const [, setAppState] = useState<AppStateStatus>(AppState.currentState)

  // Catches better the otherwise not extremely consistent app state change.
  // {@link https://stackoverflow.com/a/62773667/1333836}
  const handleAppStateChange = useCallback(
    (nextAppState) =>
      setAppState((currentAppState) => {
        if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground!
          promptToUnlock()
        } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
          // App has come to background!
          if (
            shouldLockWhenInactive &&
            !global.isAskingForPermission &&
            !global.isAskingForLocalAuth
          ) {
            lock()
          }
        }
        return nextAppState
      }),
    [promptToUnlock, shouldLockWhenInactive, lock]
  )

  useEffect(() => {
    if (!shouldLockWhenInactive) return

    const stateChange = AppState.addEventListener('change', handleAppStateChange)

    return () => stateChange.remove()
  }, [handleAppStateChange, shouldLockWhenInactive])
}

export default useUnlockWithBiometrics
