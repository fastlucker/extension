import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import { SECURE_STORE_KEY_ACCOUNTS_PASSWORDS } from '@modules/settings/constants'

type AccountsPasswordsContextData = {
  selectedAccHasPassword: boolean
  addAccountPassword: (accountId: string, password: string) => Promise<boolean>
}

const AccountsPasswordsContext = createContext<AccountsPasswordsContextData>({
  selectedAccHasPassword: false,
  addAccountPassword: () => Promise.resolve(false)
})

const AccountsPasswordsProvider: React.FC = ({ children }) => {
  const { selectedAcc } = useAccounts()
  const [accountsPasswords, setAccountsPasswords] = useState<{ [accountId: string]: string }>({})
  const [selectedAccHasPassword, setSelectedAccHasPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      const secureStoreItemAccountsPasswords = await SecureStore.getItemAsync(
        SECURE_STORE_KEY_ACCOUNTS_PASSWORDS
      )
      if (secureStoreItemAccountsPasswords) {
        const passwords = JSON.parse(secureStoreItemAccountsPasswords) || {}
        setAccountsPasswords(passwords)
        setSelectedAccHasPassword(!!passwords[selectedAcc])
      }

      setIsLoading(false)
    })()
  }, [])

  const addAccountPassword = async (accountId: string, password: string) => {
    const secureStoreItemAccountsPasswords = await SecureStore.getItemAsync(
      SECURE_STORE_KEY_ACCOUNTS_PASSWORDS
    )

    const nextPasswords = {
      ...(secureStoreItemAccountsPasswords && JSON.parse(secureStoreItemAccountsPasswords)),
      [accountId]: password
    }

    setAccountsPasswords(nextPasswords)
    await SecureStore.setItemAsync(
      SECURE_STORE_KEY_ACCOUNTS_PASSWORDS,
      JSON.stringify(nextPasswords)
    )

    setSelectedAccHasPassword(true)
    return true
  }

  return (
    <AccountsPasswordsContext.Provider
      value={useMemo(
        () => ({
          addAccountPassword,
          selectedAccHasPassword
        }),
        [isLoading, selectedAccHasPassword]
      )}
    >
      {children}
    </AccountsPasswordsContext.Provider>
  )
}

export { AccountsPasswordsContext, AccountsPasswordsProvider }
