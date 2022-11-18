import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import { SyncStorage } from '@config/storage'
import useToast from '@modules/common/hooks/useToast'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import { isExtension } from '@web/constants/browserAPI'
import { BACKGROUND } from '@web/constants/paths'
import { getStore } from '@web/functions/storage'
import { sendMessage } from '@web/services/ambexMessanger'

import { vaultContextDefaults, VaultContextReturnType } from './types'

const VaultContext = createContext<VaultContextReturnType>(vaultContextDefaults)

const sendVaultMessage = ({
  method,
  props
}: {
  method: string
  props?: { [key: string]: any }
}) => {
  return new Promise((resolve, reject) => {
    if (sendMessage) {
      sendMessage({
        type: 'vaultController',
        to: BACKGROUND,
        data: {
          method,
          props
        }
      })
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    } else {
      reject()
    }
  })
}

const VaultProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()

  const [vaultStatus, setVaultStatus] = useState<VAULT_STATUS>(VAULT_STATUS.LOADING)

  useEffect(() => {
    ;(async () => {
      if (isExtension) {
        const store: any = (await getStore(['password'])) || {}
        if (store.password) {
          sendVaultMessage({
            method: 'isVaultUnlocked'
          }).then((res: any) => {
            setVaultStatus(res ? VAULT_STATUS.UNLOCKED : VAULT_STATUS.LOCKED)
          })
        } else {
          setVaultStatus(VAULT_STATUS.NOT_INITIALIZED)
        }
      }
    })()
  }, [])

  const createVault = useCallback(
    ({ password, confirmPassword }: { password: string; confirmPassword: string }) => {
      if (password === confirmPassword) {
        sendVaultMessage({
          method: 'createVault',
          props: {
            password
          }
        }).then(() => {
          // Reset added accounts in case there are some left in the memory
          SyncStorage.setItem('accounts', JSON.stringify([]))
          SyncStorage.setItem('selectedAcc', '')
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [t, addToast]
  )

  const unlockVault = useCallback(
    ({ password }: { password: string }) => {
      sendVaultMessage({
        method: 'unlockVault',
        props: {
          password
        }
      })
        .then(() => {
          setVaultStatus(VAULT_STATUS.UNLOCKED)
        })
        .catch(() => {
          addToast(t('Wrong password. Please try again.'))
        })
    },
    [t, addToast]
  )

  return (
    <VaultContext.Provider
      value={useMemo(
        () => ({ vaultStatus, createVault, unlockVault }),
        [vaultStatus, createVault, unlockVault]
      )}
    >
      {children}
    </VaultContext.Provider>
  )
}

export { VaultContext, VaultProvider }
