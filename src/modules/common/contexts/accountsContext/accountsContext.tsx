import useAccounts, {
  UseAccountsProps,
  UseAccountsReturnType
} from 'ambire-common/src/hooks/useAccounts'
import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import * as CrashAnalytics from '@config/analytics/CrashAnalytics'
import { ROTES } from '@config/Router/routesConfig'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation/useNavigation'
import useStorage from '@modules/common/hooks/useStorage'
import useToasts from '@modules/common/hooks/useToast'
import { getUiType } from '@web/utils/uiType'

const AccountsContext = createContext<UseAccountsReturnType>({
  accounts: [],
  account: {},
  selectedAcc: '',
  onSelectAcc: () => {},
  onAddAccount: () => false,
  onRemoveAccount: () => {},
  onRemoveAllAccounts: () => {}
})

const AccountsProvider: React.FC<any> = ({ children }) => {
  const { setAuthStatus, authStatus } = useAuth()
  const { approval } = useExtensionApproval()
  const { navigate } = useNavigation()

  const onAdd = useCallback<UseAccountsProps['onAdd']>(
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
      if (getUiType().isNotification) {
        if (approval) {
          return
        }
      }

      // If the user is authenticated, a manual redirect is needed,
      // because the logged-in state screens were already mounted.
      if (opts.shouldRedirect) {
        navigate(ROTES.dashboard)
      }
    },
    [authStatus, setAuthStatus, approval, navigate]
  )

  const onRemoveLastAccount = useCallback<UseAccountsProps['onRemoveLastAccount']>(() => {
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
