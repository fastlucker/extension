import React, { createContext, Dispatch, useEffect, useMemo, useState } from 'react'

import useStorage from '@common/hooks/useStorage'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'

type AuthContextData = {
  authStatus: AUTH_STATUS
  setAuthStatus: Dispatch<React.SetStateAction<AUTH_STATUS>>
}

const AuthContext = createContext<AuthContextData>({
  authStatus: AUTH_STATUS.LOADING,
  setAuthStatus: () => false
})

const AuthProvider: React.FC = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AUTH_STATUS>(AUTH_STATUS.LOADING)
  const [selectedAcc] = useStorage({
    key: 'selectedAcc',
    isStringStorage: true
  })

  useEffect(() => {
    if (selectedAcc) {
      setAuthStatus(AUTH_STATUS.AUTHENTICATED)
    } else {
      setAuthStatus(AUTH_STATUS.NOT_AUTHENTICATED)
    }
  }, [selectedAcc])

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ authStatus, setAuthStatus }), [authStatus, setAuthStatus])}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
