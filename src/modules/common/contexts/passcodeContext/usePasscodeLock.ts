import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { PASSCODE_STATES } from './constants'

const usePasscodeLock = (
  state: PASSCODE_STATES,
  isAppLocked: boolean,
  lockWhenInactive: boolean,
  triggerValidateLocalAuth: () => void,
  setIsAppLocked: Dispatch<SetStateAction<boolean>>
) => {
  const [, setAppState] = useState<AppStateStatus>(AppState.currentState)

  // When app starts, immediately prompt user for local auth validation.
  // TODO: For some reason, enabling this makes the other part slooooooooow.
  // useEffect(() => {
  //   const shouldPromptLocalAuth = isAppLocked && state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
  //   if (shouldPromptLocalAuth) {
  //     triggerValidateLocalAuth()
  //   }
  // }, [isAppLocked, state])

  // Catches better the otherwise not extremely consistent app state change.
  // {@link https://stackoverflow.com/a/62773667/1333836}
  const handleAppStateChange = useCallback(
    (nextAppState) =>
      setAppState((currentAppState) => {
        if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground!
          const shouldPromptLocalAuth =
            isAppLocked && lockWhenInactive && state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          if (shouldPromptLocalAuth) {
            triggerValidateLocalAuth()
          }
        } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
          // App has come to background!
          if (lockWhenInactive && !global.isAskingForPermission) {
            setIsAppLocked(true)
          }
        }
        return nextAppState
      }),
    // only pass function as handleAppStateChange
    // on mount by providing empty dependency
    [triggerValidateLocalAuth, isAppLocked, setIsAppLocked, lockWhenInactive, state]
  )

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => AppState.removeEventListener('change', handleAppStateChange)
  }, [handleAppStateChange])
}

export default usePasscodeLock
