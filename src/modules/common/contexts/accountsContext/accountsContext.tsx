import useAccounts, { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import * as CrashAnalytics from '@config/analytics/CrashAnalytics'
import { isWeb } from '@config/env'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import useAmbireExtension from '@modules/common/hooks/useAmbireExtension'
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
  // NOTE: AmbireExtensionProvider is initialized after AccountsProvider
  // therefore the methods of useAmbireExtension can be used after
  // the initialization of both providers.
  const { isTempExtensionPopup, params } = useAmbireExtension()

  const onAdd = useCallback(
    (opts) => {
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) {
        // Flipping the flag is all it's needed, because it changes the
        // Router state that redirects the user to the logged-in state screens.
        return setAuthStatus(AUTH_STATUS.AUTHENTICATED)
      }

      // Should be executed only when a dApp requests permission granting
      // and there are no accounts added yet. (the Auth route will be opened at that time)
      // After adding the first account navigate to PermissionRequest screen
      // Otherwise, skip that step and open directly Dashboard
      if (isWeb && isTempExtensionPopup) {
        if (params.route === 'permission-request') {
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
    [authStatus, setAuthStatus, isTempExtensionPopup, params?.route]
  )

  const onRemoveLastAccount = useCallback(() => {
    setAuthStatus(AUTH_STATUS.NOT_AUTHENTICATED)
  }, [setAuthStatus])

  const {
    accounts,
    account,
    selectedAcc,
    onSelectAcc,
    onAddAccount,
    onRemoveAccount,
    onRemoveAllAccounts
  } = useAccounts({
    useStorage,
    onRemoveLastAccount,
    onAdd,
    useToasts
  })

  useEffect(() => {
    CrashAnalytics.setUserContext({ id: selectedAcc || 'N/A' })
  }, [selectedAcc])

  return (
    <AccountsContext.Provider
      value={useMemo(
        () => ({
          accounts,
          account,
          selectedAcc,
          onSelectAcc,
          onAddAccount,
          onRemoveAccount,
          onRemoveAllAccounts
        }),
        [
          accounts,
          account,
          selectedAcc,
          onSelectAcc,
          onAddAccount,
          onRemoveAccount,
          onRemoveAllAccounts
        ]
      )}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export { AccountsContext, AccountsProvider }
