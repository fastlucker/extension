import { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { PASSCODE_STATES } from './constants'

const usePasscodeLock = (
  state: PASSCODE_STATES,
  isAppLocked: boolean,
  triggerValidateLocalAuth: () => void
) => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)

  // When app starts, immediately prompt user for local auth validation.
  // TODO: For some reason, enabling this makes the other part slooooooooow.
  // useEffect(() => {
  //   const shouldPromptLocalAuth = isAppLocked && state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
  //   if (shouldPromptLocalAuth) {
  //     triggerValidateLocalAuth()
  //   }
  // }, [isAppLocked, state])

  const handleAppStateChange = useCallback(
    (nextAppState) =>
      setAppState((currentAppState) => {
        if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground!
          const shouldPromptLocalAuth =
            isAppLocked && state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
          if (shouldPromptLocalAuth) {
            triggerValidateLocalAuth()
          }
        } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
          // App has come to background!
        }
        return nextAppState
      }),
    // only pass function as handleAppStateChange
    // on mount by providing empty dependency
    [isAppLocked, state]
  )

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    // clean up code when component unmounts
    return () => AppState.removeEventListener('change', handleAppStateChange)
    // handleAppStateChange is a dependency but useCallback
    // has empty dependency so it is only created on mount
  }, [handleAppStateChange])

  // TODO:
  // useEffect(() => {
  //   if (appState !== 'active') {
  //     return
  //   }

  //   const shouldPromptLocalAuth = isAppLocked && state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH
  //   if (shouldPromptLocalAuth) {
  //     triggerValidateLocalAuth()
  //   }
  // }, [appState])
}

export default usePasscodeLock
