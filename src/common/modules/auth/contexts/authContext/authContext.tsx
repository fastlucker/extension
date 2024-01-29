import React, { createContext, Dispatch, useEffect, useMemo, useState } from 'react'

import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useMainControllerState from '@web/hooks/useMainControllerState'

type AuthContextData = {
  authStatus: AUTH_STATUS
  setAuthStatus: Dispatch<React.SetStateAction<AUTH_STATUS>>
  isAuthStatusTakingTooLong: boolean
}

const AuthContext = createContext<AuthContextData>({
  authStatus: AUTH_STATUS.LOADING,
  setAuthStatus: () => false,
  isAuthStatusTakingTooLong: false
})

const AuthProvider: React.FC = ({ children }: any) => {
  const [authStatus, setAuthStatus] = useState<AUTH_STATUS>(AUTH_STATUS.LOADING)
  const [isAuthStatusTakingTooLong, setIsAuthStatusTakingTooLong] = useState(false)
  const mainCtrlState = useMainControllerState()

  useEffect(() => {
    // Safeguard against a potential race condition where the auth status might
    // not get set properly. After the timeout is reached, the app will display
    // feedback to the user (using the `isAuthStatusTakingTooLong` flag).
    const timeout = setTimeout(() => setIsAuthStatusTakingTooLong(true), 10000)

    if (mainCtrlState.isReady) {
      clearTimeout(timeout)
      setAuthStatus(
        mainCtrlState?.accounts?.length ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.NOT_AUTHENTICATED
      )
    }

    return () => clearTimeout(timeout)
  }, [mainCtrlState.isReady, mainCtrlState?.accounts?.length])

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ authStatus, setAuthStatus, isAuthStatusTakingTooLong }),
        [authStatus, setAuthStatus, isAuthStatusTakingTooLong]
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
