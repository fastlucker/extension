import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { APP_LOCK_STATES } from '../../contexts/appLockContext/constants'

const useAppLockMechanism = (
  state: APP_LOCK_STATES,
  isAppLocked: boolean,
  lockWhenInactive: boolean,
  triggerValidateLocalAuth: () => void,
  setIsAppLocked: Dispatch<SetStateAction<boolean>>,
  setPasscodeError: Dispatch<SetStateAction<string>>
) => {
  const [isInitialAppOpen, setIsInitialAppOpen] = useState(true)
  const [, setAppState] = useState<AppStateStatus>(AppState.currentState)

  // Run this hook only once, when app starts.
  // Otherwise, it interferes with the rest of the logic
  // and makes the app state change event veeeeryyyy slooooooooow.
  useEffect(() => {
    if (!isInitialAppOpen) return

    if (isAppLocked && state === APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS) {
      setIsInitialAppOpen(false)
      triggerValidateLocalAuth()
    }
  }, [isInitialAppOpen, isAppLocked, state, triggerValidateLocalAuth])

  // Catches better the otherwise not extremely consistent app state change.
  // {@link https://stackoverflow.com/a/62773667/1333836}
  const handleAppStateChange = useCallback(
    (nextAppState) =>
      setAppState((currentAppState) => {
        if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground!
          const shouldPromptLocalAuth =
            isAppLocked && lockWhenInactive && state === APP_LOCK_STATES.PASSCODE_AND_BIOMETRICS
          if (shouldPromptLocalAuth) {
            triggerValidateLocalAuth()
          }
        } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
          // App has come to background!
          if (lockWhenInactive && !global.isAskingForPermission && !global.isAskingForLocalAuth) {
            setIsAppLocked(true)
            // Clear the passcode error, otherwise, it gets persisted,
            // and the next time when app opens - it gets instantly displayed
            // which is a bit misleading.
            setPasscodeError('')
          }
        }
        return nextAppState
      }),
    [
      triggerValidateLocalAuth,
      isAppLocked,
      setIsAppLocked,
      lockWhenInactive,
      state,
      setPasscodeError
    ]
  )

  useEffect(() => {
    const stateChange = AppState.addEventListener('change', handleAppStateChange)

    return () => stateChange.remove()
  }, [handleAppStateChange])
}

export default useAppLockMechanism
