import { useEffect } from 'react'
import { AppState } from 'react-native'

import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'

import usePasscode from '../usePasscode'

const useAppLocksmith = () => {
  const { lockApp, isLoading, lockWhenInactive } = usePasscode()
  const { authStatus } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (authStatus !== AUTH_STATUS.AUTHENTICATED) return
    if (!lockWhenInactive) return

    const lockListener = AppState.addEventListener('change', (nextState) => {
      // The app is running in the background means that user is either:
      // in another app, on the home screen or [Android] on another Activity
      // (even if it was launched by our app).
      if (nextState === 'background') {
        lockApp()
      }
    })
    return () => lockListener?.remove()
  }, [isLoading, lockWhenInactive, authStatus])
}

export default useAppLocksmith
