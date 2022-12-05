import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useStorageController from '@modules/common/hooks/useStorageController'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import VaultController from '@modules/vault/services/VaultController'
import { VaultItem } from '@modules/vault/services/VaultController/types'
import { isExtension } from '@web/constants/browserAPI'
import { BACKGROUND } from '@web/constants/paths'
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
    sendMessage({
      type: 'vaultController',
      to: BACKGROUND,
      data: {
        method,
        props
      }
    })
      .then((res: any) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

const VaultProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { onRemoveAllAccounts } = useAccounts()
  const { getItem, storageControllerInstance } = useStorageController()

  const vaultController = useMemo(
    () => !isExtension && new VaultController(storageControllerInstance),
    [storageControllerInstance]
  )
  const [vaultStatus, setVaultStatus] = useState<VAULT_STATUS>(VAULT_STATUS.LOADING)

  useEffect(() => {
    const vault = getItem('vault')
    if (!vault) {
      setVaultStatus(VAULT_STATUS.NOT_INITIALIZED)
      return
    }

    if (isExtension) {
      requestVaultControllerMethod({
        method: 'isVaultUnlocked'
      }).then((isUnlocked) => {
        setVaultStatus(isUnlocked ? VAULT_STATUS.UNLOCKED : VAULT_STATUS.LOCKED)
      })
    } else {
      const isUnlocked = vaultController.isVaultUnlocked()
      setVaultStatus(isUnlocked ? VAULT_STATUS.UNLOCKED : VAULT_STATUS.LOCKED)
    }
  }, [vaultController, getItem])

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
        ;(isExtension
          ? requestVaultControllerMethod({
              method: 'createVault',
              props: {
                password
              }
            })
          : vaultController.createVault({ password })
        ).then(() => {
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
          !!nextRoute && navigate(nextRoute)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [t, addToast, vaultController]
  )

  const resetVault = useCallback(
    ({
      password,
      confirmPassword
    }: {
      password: string
      confirmPassword: string
      nextRoute?: string
    }) => {
      if (password === confirmPassword) {
        ;(isExtension
          ? requestVaultControllerMethod({
              method: 'resetVault',
              props: {
                password
              }
            })
          : vaultController.resetVault({ password })
        ).then(() => {
          onRemoveAllAccounts()
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [t, addToast, onRemoveAllAccounts, vaultController]
  )

  const unlockVault = useCallback(
    (props: { password: string }) => {
      ;(isExtension
        ? requestVaultControllerMethod({
            method: 'unlockVault',
            props
          })
        : vaultController.unlockVault(props)
      )
        .then(() => {
          setVaultStatus(VAULT_STATUS.UNLOCKED)
        })
        .catch((e) => {
          addToast(e?.message || e, { error: true })
        })
    },
    [addToast, vaultController]
  )

  const isValidPassword = useCallback(
    async (props: { password: string }) => {
      if (isExtension) {
        const res = await requestVaultControllerMethod({
          method: 'isValidPassword',
          props
        })

        return res as boolean
      }

      return vaultController.isValidPassword(props)
    },
    [vaultController]
  )

  const addToVault = useCallback(
    async (props: { addr: string; item: VaultItem }) => {
      const res = await (isExtension
        ? requestVaultControllerMethod({
            method: 'addToVault',
            props
          })
        : vaultController.addToVault(props))

      return res
    },
    [vaultController]
  )

  const removeFromVault = useCallback(
    async (props: { addr: string }) => {
      const res = await (isExtension
        ? requestVaultControllerMethod({
            method: 'removeFromVault',
            props
          })
        : vaultController.removeFromVault(props))

      return res
    },
    [vaultController]
  )

  const isSignerAddedToVault = useCallback(
    async (props: { addr: string }) => {
      if (isExtension) {
        const res = await requestVaultControllerMethod({
          method: 'isSignerAddedToVault',
          props
        })

        return res as boolean
      }

      return vaultController.isSignerAddedToVault(props)
    },
    [vaultController]
  )

  const getSignerType = useCallback(
    async (props: { addr: string }) => {
      if (isExtension) {
        const res = await requestVaultControllerMethod({
          method: 'getSignerType',
          props
        })

        return res as string
      }

      return vaultController.getSignerType(props)
    },
    [vaultController]
  )

  const signTxnQuckAcc = useCallback(
    async (props: { finalBundle: any; primaryKeyBackup: string; signature: any }) => {
      const res = await (isExtension
        ? requestVaultControllerMethod({
            method: 'signTxnQuckAcc',
            props
          })
        : vaultController.signTxnQuckAcc(props))

      return res
    },
    [vaultController]
  )

  const signTxnExternalSigner = useCallback(
    async (props: {
      finalBundle: any
      estimation: any
      feeSpeed: any
      account: any
      network: any
    }) => {
      const res = await (isExtension
        ? requestVaultControllerMethod({
            method: 'signTxnExternalSigner',
            props
          })
        : vaultController.signTxnExternalSigner(props))

      return res
    },
    [vaultController]
  )

  const signMsgQuickAcc = useCallback(
    async (props: {
      account: any
      network: any
      msgToSign: any
      dataV4: any
      isTypedData: any
      signature: any
    }) => {
      const res = await (isExtension
        ? requestVaultControllerMethod({
            method: 'signMsgQuickAcc',
            props
          })
        : vaultController.signMsgQuickAcc(props))

      return res
    },
    [vaultController]
  )

  const signMsgExternalSigner = useCallback(
    async (props: {
      account: any
      network: any
      msgToSign: any
      dataV4: any
      isTypedData: any
    }) => {
      const res = await (isExtension
        ? requestVaultControllerMethod({
            method: 'signMsgExternalSigner',
            props
          })
        : vaultController.signMsgExternalSigner(props))

      return res
    },
    [vaultController]
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
          isSignerAddedToVault,
          getSignerType,
          signTxnQuckAcc,
          signTxnExternalSigner,
          signMsgQuickAcc,
          signMsgExternalSigner
        }),
        [
          vaultStatus,
          createVault,
          resetVault,
          unlockVault,
          isValidPassword,
          addToVault,
          removeFromVault,
          isSignerAddedToVault,
          getSignerType,
          signTxnQuckAcc,
          signTxnExternalSigner,
          signMsgQuickAcc,
          signMsgExternalSigner
        ]
      )}
    >
      {children}
    </VaultContext.Provider>
  )
}

export { VaultContext, VaultProvider }
