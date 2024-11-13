/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { createContext, Dispatch, useEffect, useMemo, useState } from 'react'

import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

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
  const accountsState = useAccountsControllerState()
  const { account } = useSelectedAccountControllerState()

  useEffect(() => {
    // authStatus = AUTH_STATUS.LOADING while mainCtrlState not initialized in the context yet
    if (!accountsState.accounts) return

    // if no accounts were added authStatus = AUTH_STATUS.NOT_AUTHENTICATED
    if (!accountsState.accounts?.length) {
      setAuthStatus(AUTH_STATUS.NOT_AUTHENTICATED)
      return
    }

    if (account) {
      setAuthStatus(AUTH_STATUS.AUTHENTICATED)
    }
  }, [accountsState.accounts, account])

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ authStatus, setAuthStatus }), [authStatus, setAuthStatus])}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
