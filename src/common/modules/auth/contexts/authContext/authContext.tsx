/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { createContext, Dispatch, useEffect, useMemo, useState } from 'react'

import { getDefaultSelectedAccount } from '@ambire-common/libs/account/account'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useBackgroundService from '@web/hooks/useBackgroundService'
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
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    // authStatus = AUTH_STATUS.LOADING while mainCtrlState not initialized in the context yet
    if (!mainCtrlState.accounts) return

    // if no accounts were added authStatus = AUTH_STATUS.NOT_AUTHENTICATED
    if (!mainCtrlState.accounts?.length) {
      setAuthStatus(AUTH_STATUS.NOT_AUTHENTICATED)
      return
    }

    if (mainCtrlState.selectedAccount) {
      setAuthStatus(AUTH_STATUS.AUTHENTICATED)
    } else {
      // fallback: should never happen
      console.warn(
        'Warning: no selected account was found. Proceeding with the fallback logic for selecting an account'
      )
      const selectedAccount = getDefaultSelectedAccount(mainCtrlState?.accounts)
      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: selectedAccount?.addr || mainCtrlState.accounts[0].addr }
      })
    }
  }, [
    dispatch,
    mainCtrlState?.accounts?.length,
    mainCtrlState.accounts,
    mainCtrlState.selectedAccount
  ])

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ authStatus, setAuthStatus }), [authStatus, setAuthStatus])}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
