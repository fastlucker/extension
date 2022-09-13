import useAccounts, { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import * as CrashAnalytics from '@config/analytics/CrashAnalytics'
import { isWeb } from '@config/env'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import useStorage from '@modules/common/hooks/useStorage'
import useToasts from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'

const AccountsContext = createContext<UseAccountsReturnType>({
  accounts: [],
  account: {},
  selectedAcc: '',
  onSelectAcc: () => {},
  onAddAccount: () => false,
  onRemoveAccount: () => {}
})

const AccountsProvider: React.FC = ({ children }) => {
  const { setAuthStatus, authStatus } = useAuth()

  const onAdd = useCallback(
    (opts) => {
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) {
        // Flipping the flag is all it's needed, because it changes the
        // Router state that redirects the user to the logged-in state screens.
        return setAuthStatus(AUTH_STATUS.AUTHENTICATED)
      }

      if (isWeb) {
        const urlSearchParams = new URLSearchParams(window?.location?.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        if (params.initialRoute === 'permission-request') {
          navigate('permission-request')
          return
        }
      }

      // If the user is authenticated, a manual redirect is needed,
      // because the logged-in state screens were already mounted.
      if (opts.shouldRedirect) {
        navigate('dashboard')
      }
    },
    [authStatus, setAuthStatus]
  )

  const onRemoveLastAccount = useCallback(() => {
    setAuthStatus(AUTH_STATUS.NOT_AUTHENTICATED)
  }, [setAuthStatus])

  const { accounts, account, selectedAcc, onSelectAcc, onAddAccount, onRemoveAccount } =
    useAccounts({
      useStorage,
      onRemoveLastAccount,
      onAdd,
      useToasts
    })

  useEffect(() => {
    // TODO: figure out why this crashes on web
    if (!isWeb) {
      CrashAnalytics.setUserContext({ id: selectedAcc || 'N/A' })
    }
  }, [selectedAcc])

  return (
    <AccountsContext.Provider
      value={useMemo(
        () => ({ accounts, account, selectedAcc, onSelectAcc, onAddAccount, onRemoveAccount }),
        [accounts, account, selectedAcc, onSelectAcc, onAddAccount, onRemoveAccount]
      )}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export { AccountsContext, AccountsProvider }
