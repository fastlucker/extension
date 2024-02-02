import React, { createContext, Dispatch, useEffect, useMemo, useState } from 'react'

import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useMainControllerState from '@web/hooks/useMainControllerState'

type AuthContextData = {
  authStatus: AUTH_STATUS
  setAuthStatus: Dispatch<React.SetStateAction<AUTH_STATUS>>
}

const AuthContext = createContext<AuthContextData>({
  authStatus: AUTH_STATUS.LOADING,
  setAuthStatus: () => false
})

const AuthProvider: React.FC = ({ children }: any) => {
  const [authStatus, setAuthStatus] = useState<AUTH_STATUS>(AUTH_STATUS.LOADING)
  const mainCtrlState = useMainControllerState()

  useEffect(() => {
    setAuthStatus(
      mainCtrlState?.accounts?.length ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.NOT_AUTHENTICATED
    )
  }, [mainCtrlState?.accounts?.length])

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ authStatus, setAuthStatus }), [authStatus, setAuthStatus])}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
