import useAccounts, {
  onAddAccountOptions,
  UseAccountsReturnType
} from 'ambire-common/src/hooks/accounts'
import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import * as CrashAnalytics from '@config/analytics/CrashAnalytics'
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

  console.log('outside', authStatus)
  const onAdd = useCallback(
    (opts: onAddAccountOptions) => {
      // TODO: Figure out why the memoized one is cashed :(
      console.log('memoized', authStatus)
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) {
        return setAuthStatus(AUTH_STATUS.AUTHENTICATED)
      }

      if (opts.shouldRedirect) navigate('dashboard')
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
    CrashAnalytics.setUserContext({ id: selectedAcc || 'N/A' })
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
