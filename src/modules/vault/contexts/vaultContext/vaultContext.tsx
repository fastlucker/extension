import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import { SyncStorage } from '@config/storage'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'
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
  const { accounts, onRemoveAccount } = useAccounts()

  const [vaultStatus, setVaultStatus] = useState<VAULT_STATUS>(VAULT_STATUS.LOADING)

  useEffect(() => {
    ;(async () => {
      if (isExtension) {
        const store: any = (await getStore(['vault'])) || {}
        if (store.vault) {
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
    ({
      password,
      confirmPassword,
      nextRoute
    }: {
      password: string
      confirmPassword: string
      nextRoute?: string
    }) => {
      if (password === confirmPassword) {
        sendVaultMessage({
          method: 'createVault',
          props: {
            password
          }
        }).then(() => {
          // Reset added accounts in case there are some left in the memory
          accounts.forEach((acc) => onRemoveAccount(acc.id))
          SyncStorage.setItem('selectedAcc', '')
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
          !!nextRoute && navigate(nextRoute)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [accounts, onRemoveAccount, t, addToast]
  )

  const resetVault = useCallback(
    ({
      password,
      confirmPassword,
      nextRoute
    }: {
      password: string
      confirmPassword: string
      nextRoute?: string
    }) => {
      if (password === confirmPassword) {
        sendVaultMessage({
          method: 'resetVault',
          props: {
            password
          }
        }).then(() => {
          // Reset added accounts in case there are some left in the memory
          accounts.forEach((acc) => onRemoveAccount(acc.id))
          SyncStorage.setItem('selectedAcc', '')
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
          !!nextRoute && navigate(nextRoute)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [accounts, onRemoveAccount, t, addToast]
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
        () => ({ vaultStatus, createVault, resetVault, unlockVault }),
        [vaultStatus, createVault, resetVault, unlockVault]
      )}
    >
      {children}
    </VaultContext.Provider>
  )
}

export { VaultContext, VaultProvider }
