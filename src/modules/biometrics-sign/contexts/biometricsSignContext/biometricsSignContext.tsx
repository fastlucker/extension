import * as SecureStore from 'expo-secure-store'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useStorageController from '@modules/common/hooks/useStorageController'
import useToast from '@modules/common/hooks/useToast'
import { requestLocalAuthFlagging } from '@modules/common/services/requestPermissionFlagging'
import { SECURE_STORE_KEY_KEYSTORE_PASSWORD } from '@modules/settings/constants'

import { biometricsSignContextDefaults, BiometricsSignContextReturnType } from './types'

const BiometricsSignContext = createContext<BiometricsSignContextReturnType>(
  biometricsSignContextDefaults
)

const BiometricsSignProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { getItem, setItem, removeItem } = useStorageController()
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(
    biometricsSignContextDefaults.biometricsEnabled
  )

  useEffect(() => {
    // Checks via a flag in the Async Storage.
    // Because otherwise, figuring out if the selected account has password
    // via the `SecureStore` requires the user every time to
    // authenticate via his phone local auth.
    const hasBiometricsEnabled = !!getItem(SECURE_STORE_KEY_KEYSTORE_PASSWORD)

    setBiometricsEnabled(hasBiometricsEnabled)
  }, [getItem])

  const addKeystorePasswordToDeviceSecureStore = useCallback(
    async (password: string) => {
      try {
        await requestLocalAuthFlagging(() =>
          SecureStore.setItemAsync(SECURE_STORE_KEY_KEYSTORE_PASSWORD, password, {
            authenticationPrompt: t('Confirm your identity'),
            requireAuthentication: true,
            keychainService: SECURE_STORE_KEY_KEYSTORE_PASSWORD
          })
        )

        // Store a flag if the selected account has password stored.
        // This is for ease of use across the other parts of the app.
        // Because otherwise, figuring out if the selected account has password
        // via the `SecureStore` requires the user every time to
        // authenticate via his phone local auth.
        setItem(SECURE_STORE_KEY_KEYSTORE_PASSWORD, 'true')

        setBiometricsEnabled(true)
        return true
      } catch (error) {
        addToast(t('Error saving. {{error}}}', { error }) as string, {
          error: true
        })
        return false
      }
    },
    [addToast, t, setItem]
  )

  const removeKeystorePasswordFromDeviceSecureStore = useCallback(async () => {
    try {
      await requestLocalAuthFlagging(() =>
        SecureStore.deleteItemAsync(SECURE_STORE_KEY_KEYSTORE_PASSWORD, {
          authenticationPrompt: t('Confirm your identity'),
          requireAuthentication: true,
          keychainService: SECURE_STORE_KEY_KEYSTORE_PASSWORD
        })
      )

      removeItem(SECURE_STORE_KEY_KEYSTORE_PASSWORD)
      setBiometricsEnabled(false)

      return true
    } catch (e) {
      addToast(t('Removing account password failed.') as string, { error: true })
      return false
    }
  }, [addToast, t, removeItem])

  const getVaultPassword = useCallback(() => {
    return requestLocalAuthFlagging(() =>
      SecureStore.getItemAsync(SECURE_STORE_KEY_KEYSTORE_PASSWORD, {
        authenticationPrompt: t('Confirm your identity'),
        requireAuthentication: true,
        keychainService: SECURE_STORE_KEY_KEYSTORE_PASSWORD
      })
    )
  }, [t])

  return (
    <BiometricsSignContext.Provider
      value={useMemo(
        () => ({
          addKeystorePasswordToDeviceSecureStore,
          biometricsEnabled,
          removeKeystorePasswordFromDeviceSecureStore,
          getVaultPassword
        }),
        [
          biometricsEnabled,
          getVaultPassword,
          addKeystorePasswordToDeviceSecureStore,
          removeKeystorePasswordFromDeviceSecureStore
        ]
      )}
    >
      {children}
    </BiometricsSignContext.Provider>
  )
}

export { BiometricsSignContext, BiometricsSignProvider }
