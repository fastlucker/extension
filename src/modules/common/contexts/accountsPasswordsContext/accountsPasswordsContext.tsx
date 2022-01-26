import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import { SECURE_STORE_KEY_ACCOUNTS_PASSWORDS } from '@modules/settings/constants'

type AccountsPasswordsContextData = {
  isLoading: boolean
  selectedAccHasPassword: boolean
  addSelectedAccPassword: (password: string) => Promise<void>
  removeSelectedAccPassword: () => Promise<void>
}

const AccountsPasswordsContext = createContext<AccountsPasswordsContextData>({
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(),
  removeSelectedAccPassword: () => Promise.resolve()
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

  const addSelectedAccPassword = async (password: string) => {
    const secureStoreItemAccountsPasswords = await SecureStore.getItemAsync(
      SECURE_STORE_KEY_ACCOUNTS_PASSWORDS
    )

    const nextPasswords = {
      ...(secureStoreItemAccountsPasswords && JSON.parse(secureStoreItemAccountsPasswords)),
      [selectedAcc]: password
    }

    setAccountsPasswords(nextPasswords)
    await SecureStore.setItemAsync(
      SECURE_STORE_KEY_ACCOUNTS_PASSWORDS,
      JSON.stringify(nextPasswords)
    )

    return setSelectedAccHasPassword(true)
  }

  const removeSelectedAccPassword = async () => {
    const nextPasswords = {
      ...accountsPasswords,
      [selectedAcc]: ''
    }

    setAccountsPasswords(nextPasswords)
    await SecureStore.setItemAsync(
      SECURE_STORE_KEY_ACCOUNTS_PASSWORDS,
      JSON.stringify(nextPasswords)
    )

    return setSelectedAccHasPassword(false)
  }

  return (
    <AccountsPasswordsContext.Provider
      value={useMemo(
        () => ({
          isLoading,
          addSelectedAccPassword,
          selectedAccHasPassword,
          removeSelectedAccPassword
        }),
        [isLoading, selectedAccHasPassword, selectedAcc]
      )}
    >
      {children}
    </AccountsPasswordsContext.Provider>
  )
}

export { AccountsPasswordsContext, AccountsPasswordsProvider }
