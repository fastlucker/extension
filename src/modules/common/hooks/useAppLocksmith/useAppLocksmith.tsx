import { useEffect } from 'react'
import { AppState } from 'react-native'

import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'

import usePasscode from '../usePasscode'

const useAppLocksmith = () => {
  const { lockApp, isLoading, state } = usePasscode()

  useEffect(() => {
    if (isLoading) {
      // TODO: Figure out how to persist the splash screen,
      // So that the lock screen gets displayed before the AppStack.
      return
    }

    if (state !== PASSCODE_STATES.NO_PASSCODE) {
      lockApp()
    }
  }, [isLoading])

  useEffect(() => {
    const lockListener = AppState.addEventListener('change', (nextState) => {
      // The app is running in the background means that user is either:
      // in another app, on the home screen or [Android] on another Activity
      // (even if it was launched by our app).
      if (nextState === 'background') {
        lockApp()
      }
    })
    return () => lockListener?.remove()
  }, [])
}

export default useAppLocksmith
