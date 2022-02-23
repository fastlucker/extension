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
  removeSelectedAccPassword: (accountId?: string) => Promise<boolean>
  getSelectedAccPassword: () => Promise<string>
}

const defaults: AccountsPasswordsContextData = {
  isLoading: true,
  selectedAccHasPassword: false,
  addSelectedAccPassword: () => Promise.resolve(false),
  removeSelectedAccPassword: () => Promise.resolve(false),
  getSelectedAccPassword: () => Promise.resolve('')
}

const AccountsPasswordsContext = createContext<AccountsPasswordsContextData>(defaults)

// The secure key is separate for each account. This way, it appears as a
// separate value in the Keychain / Keystore, suffixed by the account id.
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
        // Checks via a flag in the Async Storage.
        // Because otherwise, figuring out if the selected account has password
        // via the `SecureStore` requires the user every time to
        // authenticate via his phone local auth.
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
        requireAuthentication: true,
        keychainService: key
      })

      // Store a flag if the selected account has password stored.
      // This is for ease of use across the other parts of the app.
      // Because otherwise, figuring out if the selected account has password
      // via the `SecureStore` requires the user every time to
      // authenticate via his phone local auth.
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

  const removeSelectedAccPassword = async (accountId?: string) => {
    try {
      const key = getAccountSecureKey(accountId || selectedAcc)

      await SecureStore.deleteItemAsync(key, {
        authenticationPrompt: t('Confirm your identity'),
        requireAuthentication: true,
        keychainService: key
      })

      await AsyncStorage.removeItem(key)

      // If the change is made for the selected account, clean up the other flag too.
      const isForTheSelectedAccount = !accountId
      if (isForTheSelectedAccount) {
        setSelectedAccHasPassword(false)
      }

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
      requireAuthentication: true,
      keychainService: key
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
          getSelectedAccPassword
        }),
        [isLoading, selectedAccHasPassword, selectedAcc, getSelectedAccPassword]
      )}
    >
      {children}
    </AccountsPasswordsContext.Provider>
  )
}

export { AccountsPasswordsContext, AccountsPasswordsProvider }
