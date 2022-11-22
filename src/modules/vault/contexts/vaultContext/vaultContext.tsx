import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import { SyncStorage } from '@config/storage'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import { VaultItem } from '@modules/vault/services/VaultController/types'
import { isExtension } from '@web/constants/browserAPI'
import { BACKGROUND } from '@web/constants/paths'
import { getStore } from '@web/functions/storage'
import { sendMessage } from '@web/services/ambexMessanger'

import { vaultContextDefaults, VaultContextReturnType } from './types'

const VaultContext = createContext<VaultContextReturnType>(vaultContextDefaults)

const requestVaultControllerMethod = ({
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
          requestVaultControllerMethod({
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
        requestVaultControllerMethod({
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
        requestVaultControllerMethod({
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
    (props: { password: string }) => {
      requestVaultControllerMethod({
        method: 'unlockVault',
        props
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

  const isValidPassword = useCallback(async (props: { password: string }) => {
    const res = await requestVaultControllerMethod({
      method: 'isValidPassword',
      props
    })

    return res as boolean
  }, [])

  const addToVault = useCallback(async (props: { addr: string; item: VaultItem }) => {
    const res = await requestVaultControllerMethod({
      method: 'addToVault',
      props
    })

    return res
  }, [])

  const removeFromVault = useCallback(async (props: { addr: string }) => {
    const res = await requestVaultControllerMethod({
      method: 'removeFromVault',
      props
    })

    return res
  }, [])

  const getSignerType = useCallback(async (props: { addr: string }) => {
    const res = await requestVaultControllerMethod({
      method: 'getSignerType',
      props
    })

    return res as string
  }, [])

  const signQuckAcc = useCallback(
    async (props: { finalBundle: any; primaryKeyBackup: string; signature: any }) => {
      const res = await requestVaultControllerMethod({
        method: 'signQuckAcc',
        props
      })

      return res
    },
    []
  )

  const signExternalSigner = useCallback(
    async (props: {
      finalBundle: any
      estimation: any
      feeSpeed: any
      account: any
      network: any
    }) => {
      const res = await requestVaultControllerMethod({
        method: 'signExternalSigner',
        props
      })

      return res
    },
    []
  )

  return (
    <VaultContext.Provider
      value={useMemo(
        () => ({
          vaultStatus,
          createVault,
          resetVault,
          unlockVault,
          isValidPassword,
          addToVault,
          removeFromVault,
          getSignerType,
          signQuckAcc,
          signExternalSigner
        }),
        [
          vaultStatus,
          createVault,
          resetVault,
          unlockVault,
          isValidPassword,
          addToVault,
          removeFromVault,
          getSignerType,
          signQuckAcc,
          signExternalSigner
        ]
      )}
    >
      {children}
    </VaultContext.Provider>
  )
}

export { VaultContext, VaultProvider }
