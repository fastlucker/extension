import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { SECURE_STORE_KEY_ACCOUNTS_PASSWORDS } from '@modules/settings/constants'

type AccountsPasswordsContextData = {
  isLoading: boolean
  selectedAccHasPassword: boolean
  addSelectedAccPassword: (password: string) => Promise<void>
  removeSelectedAccPassword: () => Promise<void>
}

const defaults: AccountsPasswordsContextData = {
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(),
  removeSelectedAccPassword: () => Promise.resolve()
}

const AccountsPasswordsContext = createContext<AccountsPasswordsContextData>(defaults)

const AccountsPasswordsProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
  const [accountsPasswords, setAccountsPasswords] = useState<{ [accountId: string]: string }>({})
  const [selectedAccHasPassword, setSelectedAccHasPassword] = useState<boolean>(
    defaults.selectedAccHasPassword
  )
  const [isLoading, setIsLoading] = useState<boolean>(defaults.isLoading)

  useEffect(() => {
    ;(async () => {
      try {
        const secureStoreItemAccountsPasswords = await SecureStore.getItemAsync(
          SECURE_STORE_KEY_ACCOUNTS_PASSWORDS
        )
        if (secureStoreItemAccountsPasswords) {
          const passwords = JSON.parse(secureStoreItemAccountsPasswords) || {}
          setAccountsPasswords(passwords)
          setSelectedAccHasPassword(!!passwords[selectedAcc])
        }
      } catch (e) {
        // fail silently
      }

      setIsLoading(false)
    })()
  }, [selectedAcc])

  const addSelectedAccPassword = async (password: string) => {
    try {
      const secureStoreItemAccountsPasswords = await SecureStore.getItemAsync(
        SECURE_STORE_KEY_ACCOUNTS_PASSWORDS
      )

      const nextPasswords = {
        ...(secureStoreItemAccountsPasswords && JSON.parse(secureStoreItemAccountsPasswords)),
        [selectedAcc]: password
      }

      await SecureStore.setItemAsync(
        SECURE_STORE_KEY_ACCOUNTS_PASSWORDS,
        JSON.stringify(nextPasswords)
      )

      setAccountsPasswords(nextPasswords)

      return setSelectedAccHasPassword(true)
    } catch (e) {
      return addToast(t('Saving password was not successful.') as string, { error: true })
    }
  }

  const removeSelectedAccPassword = async () => {
    const nextPasswords = {
      ...accountsPasswords,
      [selectedAcc]: ''
    }

    try {
      await SecureStore.setItemAsync(
        SECURE_STORE_KEY_ACCOUNTS_PASSWORDS,
        JSON.stringify(nextPasswords)
      )
    } catch (e) {
      return addToast(t('Saving password was not successful.') as string, { error: true })
    }

    setAccountsPasswords(nextPasswords)

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
