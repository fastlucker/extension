import * as SecureStore from 'expo-secure-store'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { SECURE_STORE_KEY_ACCOUNT } from '@modules/settings/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AccountsPasswordsContextData = {
  isLoading: boolean
  selectedAccHasPassword: boolean
  addSelectedAccPassword: (password: string) => Promise<boolean>
  removeSelectedAccPassword: () => Promise<boolean>
  getSelectedAccPassword: () => string
  removeAccPasswordIfItExists: (accountId: string) => void
}

const defaults: AccountsPasswordsContextData = {
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(false),
  removeSelectedAccPassword: () => Promise.resolve(false),
  getSelectedAccPassword: () => '',
  removeAccPasswordIfItExists: () => {}
}

const AccountsPasswordsContext = createContext<AccountsPasswordsContextData>(defaults)

const getAccountSecureKey = (acc: string) => `${SECURE_STORE_KEY_ACCOUNT}-${acc}`

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
        const key = getAccountSecureKey(selectedAcc)
        const accountHasPassword = await AsyncStorage.getItem(key)

        setSelectedAccHasPassword(!!accountHasPassword)
      } catch (e) {
        // fail silently
      }

      setIsLoading(false)
    })()
  }, [selectedAcc])

  const addSelectedAccPassword = async (password: string) => {
    try {
      const key = getAccountSecureKey(selectedAcc)

      await SecureStore.setItemAsync(key, password, {
        authenticationPrompt: t('Confirm your identity'),
        requireAuthentication: true
      })

      await AsyncStorage.setItem(key, 'true')

      setSelectedAccHasPassword(true)
      return true
    } catch (error) {
      addToast(t('Error saving. {{error}}}', { error }) as string, {
        error: true
      })
      return false
    }
  }

  const removeSelectedAccPassword = async () => {
    try {
      const key = getAccountSecureKey(selectedAcc)

      await SecureStore.deleteItemAsync(key, {
        authenticationPrompt: t('Confirm your identity'),
        requireAuthentication: true
      })

      await AsyncStorage.removeItem(key)

      setSelectedAccHasPassword(false)

      return true
    } catch (e) {
      addToast(t('Saving password was not successful.') as string, { error: true })
      return false
    }
  }

  const removeAccPasswordIfItExists = async (accountId: string) => {
    const nextPasswords = {
      ...accountsPasswords,
      [accountId]: ''
    }

    try {
      await SecureStore.setItemAsync(SECURE_STORE_KEY_ACCOUNT, JSON.stringify(nextPasswords))
    } catch (e) {
      // fail silently
    }

    return setAccountsPasswords(nextPasswords)
  }

  const getSelectedAccPassword = () => accountsPasswords[selectedAcc]

  return (
    <AccountsPasswordsContext.Provider
      value={useMemo(
        () => ({
          isLoading,
          addSelectedAccPassword,
          selectedAccHasPassword,
          removeSelectedAccPassword,
          getSelectedAccPassword,
          removeAccPasswordIfItExists
        }),
        [isLoading, selectedAccHasPassword, selectedAcc]
      )}
    >
      {children}
    </AccountsPasswordsContext.Provider>
  )
}

export { AccountsPasswordsContext, AccountsPasswordsProvider }
