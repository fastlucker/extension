import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useStorageController from '@modules/common/hooks/useStorageController'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
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
  const { getItem } = useStorageController()

  const [vaultStatus, setVaultStatus] = useState<VAULT_STATUS>(VAULT_STATUS.LOADING)

  useEffect(() => {
    if (isExtension) {
      const vault = getItem('vault')
      if (vault) {
        requestVaultControllerMethod({
          method: 'isVaultUnlocked'
        }).then((isUnlocked) => {
          setVaultStatus(isUnlocked ? VAULT_STATUS.UNLOCKED : VAULT_STATUS.LOCKED)
        })
      } else {
        setVaultStatus(VAULT_STATUS.NOT_INITIALIZED)
      }
    }
  }, [getItem])

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
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
          !!nextRoute && navigate(nextRoute)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [t, addToast]
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
        requestVaultControllerMethod({
          method: 'resetVault',
          props: {
            password
          }
        }).then(() => {
          onRemoveAllAccounts()
          // Automatically unlock after vault initialization
          setVaultStatus(VAULT_STATUS.UNLOCKED)
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [t, addToast, onRemoveAllAccounts]
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
        .catch((e) => {
          addToast(e?.message || e, { error: true })
        })
    },
    [addToast]
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

  const isSignerAddedToVault = useCallback(async (props: { addr: string }) => {
    const res = await requestVaultControllerMethod({
      method: 'isSignerAddedToVault',
      props
    })

    return res as boolean
  }, [])

  const getSignerType = useCallback(async (props: { addr: string }) => {
    const res = await requestVaultControllerMethod({
      method: 'getSignerType',
      props
    })

    return res as string
  }, [])

  const signTxnQuckAcc = useCallback(
    async (props: { finalBundle: any; primaryKeyBackup: string; signature: any }) => {
      const res = await requestVaultControllerMethod({
        method: 'signTxnQuckAcc',
        props
      })

      return res
    },
    []
  )

  const signTxnExternalSigner = useCallback(
    async (props: {
      finalBundle: any
      estimation: any
      feeSpeed: any
      account: any
      network: any
    }) => {
      const res = await requestVaultControllerMethod({
        method: 'signTxnExternalSigner',
        props
      })

      return res
    },
    []
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
      const res = await requestVaultControllerMethod({
        method: 'signMsgQuickAcc',
        props
      })

      return res
    },
    []
  )

  const signMsgExternalSigner = useCallback(
    async (props: {
      account: any
      network: any
      msgToSign: any
      dataV4: any
      isTypedData: any
    }) => {
      const res = await requestVaultControllerMethod({
        method: 'signMsgExternalSigner',
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
