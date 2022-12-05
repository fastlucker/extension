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

  /**
   * For the extension, we need to get vault status from background.
   * For the web and mobile app, create a new instance of VaultController,
   * and use this instance (singleton) instead.
   */
  const vaultController = useMemo(
    () =>
      !isExtension && storageControllerInstance && new VaultController(storageControllerInstance),
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
      const isUnlocked = (vaultController as VaultController).isVaultUnlocked()
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
          : (vaultController as VaultController).createVault({ password })
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
          : (vaultController as VaultController).resetVault({ password })
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
        : (vaultController as VaultController).unlockVault(props)
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

  const lockVault = useCallback(() => {
    if (isExtension) {
      requestVaultControllerMethod({
        method: 'lockVault',
        props: {}
      })
        .then((res: any) => {
          if (
            vaultStatus !== VAULT_STATUS.LOADING &&
            vaultStatus !== VAULT_STATUS.NOT_INITIALIZED
          ) {
            setVaultStatus(res)
          }
        })
        .catch((e) => {
          addToast(e?.message || e, { error: true })
        })
    }

    const res = (vaultController as VaultController).lockVault()
    if (vaultStatus !== VAULT_STATUS.LOADING && vaultStatus !== VAULT_STATUS.NOT_INITIALIZED) {
      setVaultStatus(res)
    }
  }, [addToast, vaultStatus, vaultController])

  const isValidPassword = useCallback(
    async (props: { password: string }) => {
      if (isExtension) {
        const res = await requestVaultControllerMethod({
          method: 'isValidPassword',
          props
        })

        return res as boolean
      }

      return (vaultController as VaultController).isValidPassword(props)
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
        : (vaultController as VaultController).addToVault(props))

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
        : (vaultController as VaultController).removeFromVault(props))

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

      return (vaultController as VaultController).isSignerAddedToVault(props)
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

      return (vaultController as VaultController).getSignerType(props)
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
        : (vaultController as VaultController).signTxnQuckAcc(props))

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
        : (vaultController as VaultController).signTxnExternalSigner(props))

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
        : (vaultController as VaultController).signMsgQuickAcc(props))

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
        : (vaultController as VaultController).signMsgExternalSigner(props))

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
          lockVault,
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
          lockVault,
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
