import * as SecureStore from 'expo-secure-store'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

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
  getSelectedAccPassword: () => Promise<string>
  removeAccPasswordIfItExists: (accountId: string) => Promise<boolean>
}

const defaults: AccountsPasswordsContextData = {
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(false),
  removeSelectedAccPassword: () => Promise.resolve(false),
  getSelectedAccPassword: () => Promise.resolve(''),
  removeAccPasswordIfItExists: () => Promise.resolve(false)
}

const AccountsPasswordsContext = createContext<AccountsPasswordsContextData>(defaults)

const getAccountSecureKey = (acc: string) => `${SECURE_STORE_KEY_ACCOUNT}-${acc}`

const AccountsPasswordsProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
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
        // Fail silently and assume account doesn't have a password set
        // for the selected account. Which is fine.
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
    try {
      const key = getAccountSecureKey(accountId)

      await SecureStore.deleteItemAsync(key, {
        authenticationPrompt: t('Confirm your identity'),
        requireAuthentication: true
      })

      await AsyncStorage.removeItem(key)

      return true
    } catch (e) {
      addToast(t('Removing account password failed.') as string, { error: true })
      return false
    }
  }

  const getSelectedAccPassword = useCallback(() => {
    const key = getAccountSecureKey(selectedAcc)

    return SecureStore.getItemAsync(key, {
      authenticationPrompt: t('Confirm your identity'),
      requireAuthentication: true
    })
  }, [selectedAcc, t])

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
        [isLoading, selectedAccHasPassword, selectedAcc, getSelectedAccPassword]
      )}
    >
      {children}
    </AccountsPasswordsContext.Provider>
  )
}

export { AccountsPasswordsContext, AccountsPasswordsProvider }
