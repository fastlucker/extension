import * as SecureStore from 'expo-secure-store'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import { SyncStorage } from '@config/storage'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { requestLocalAuthFlagging } from '@modules/common/services/requestPermissionFlagging'
import { SECURE_STORE_KEY_ACCOUNT } from '@modules/settings/constants'

import { biometricsSignContextDefaults, BiometricsSignContextReturnType } from './types'

const BiometricsSignContext = createContext<BiometricsSignContextReturnType>(
  biometricsSignContextDefaults
)

// The secure key is separate for each account. This way, it appears as a
// separate value in the Keychain / Keystore, suffixed by the account id.
const getAccountSecureKey = (acc: string) => `${SECURE_STORE_KEY_ACCOUNT}-${acc}`

const BiometricsSignProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { selectedAcc } = useAccounts()
  const [selectedAccHasPassword, setSelectedAccHasPassword] = useState<boolean>(
    biometricsSignContextDefaults.selectedAccHasPassword
  )
  const [isLoading, setIsLoading] = useState<boolean>(biometricsSignContextDefaults.isLoading)

  useEffect(() => {
    ;(async () => {
      try {
        const key = getAccountSecureKey(selectedAcc)
        // Checks via a flag in the Async Storage.
        // Because otherwise, figuring out if the selected account has password
        // via the `SecureStore` requires the user every time to
        // authenticate via his phone local auth.
        const accountHasPassword = await SyncStorage.getItem(key)

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

      await requestLocalAuthFlagging(() =>
        SecureStore.setItemAsync(key, password, {
          authenticationPrompt: t('Confirm your identity'),
          requireAuthentication: true,
          keychainService: key
        })
      )

      // Store a flag if the selected account has password stored.
      // This is for ease of use across the other parts of the app.
      // Because otherwise, figuring out if the selected account has password
      // via the `SecureStore` requires the user every time to
      // authenticate via his phone local auth.
      SyncStorage.setItem(key, 'true')

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

      await requestLocalAuthFlagging(() =>
        SecureStore.deleteItemAsync(key, {
          authenticationPrompt: t('Confirm your identity'),
          requireAuthentication: true,
          keychainService: key
        })
      )

      SyncStorage.removeItem(key)

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

    return requestLocalAuthFlagging(() =>
      SecureStore.getItemAsync(key, {
        authenticationPrompt: t('Confirm your identity'),
        requireAuthentication: true,
        keychainService: key
      })
    )
  }, [selectedAcc, t])

  return (
    <BiometricsSignContext.Provider
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
    </BiometricsSignContext.Provider>
  )
}

export { BiometricsSignContext, BiometricsSignProvider }
