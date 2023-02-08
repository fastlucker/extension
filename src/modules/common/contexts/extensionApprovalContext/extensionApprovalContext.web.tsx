import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useAuth from '@modules/auth/hooks/useAuth'
import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import useToast from '@modules/common/hooks/useToast'
import useVault from '@modules/vault/hooks/useVault'
import { Approval } from '@web/background/services/notification'
import { getUiType } from '@web/utils/uiType'

import { UseExtensionApprovalReturnType } from './types'
import useSignApproval from './useSignApproval'

const ExtensionApprovalContext = createContext<UseExtensionApprovalReturnType>({
  approval: null,
  requests: [],
  hasCheckedForApprovalInitially: false,
  getApproval: () => Promise.resolve(null),
  resolveApproval: () => Promise.resolve(),
  rejectApproval: () => Promise.resolve(),
  resolveMany: () => {}
})

const ExtensionApprovalProvider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { authStatus } = useAuth()
  const { vaultStatus } = useVault()
  const { extensionWallet } = useExtensionWallet()
  const [approval, setApproval] = useState<Approval | null>(null)
  const [hasCheckedForApprovalInitially, setHasCheckedForApprovalInitially] = useState(false)

  const getApproval: UseExtensionApprovalReturnType['getApproval'] = useCallback(
    () => extensionWallet.getApproval(),
    [extensionWallet]
  )

  const resolveApproval = useCallback<UseExtensionApprovalReturnType['resolveApproval']>(
    async (data = undefined, stay = false, forceReject = false, approvalId = undefined) => {
      if (!approval) {
        return addToast(
          t(
            'Missing approval request from the dApp. Please close this window and trigger the action again from the dApp.'
          ),
          { error: true }
        )
      }

      await extensionWallet.resolveApproval(data, forceReject, approvalId)

      const nextApproval = await getApproval()
      setApproval(nextApproval)
    },
    [addToast, approval, extensionWallet, getApproval, t]
  )

  const rejectApproval = useCallback<UseExtensionApprovalReturnType['rejectApproval']>(
    async (err = undefined, stay = false, isInternal = false) => {
      if (!approval) {
        return addToast(
          t(
            'Missing approval request from the dApp. Please close this window and trigger the action again from the dApp.'
          ),
          { error: true }
        )
      }

      await extensionWallet.rejectApproval(err, stay, isInternal)

      const nextApproval = await getApproval()
      setApproval(nextApproval)
    },
    [approval, extensionWallet, getApproval, addToast, t]
  )

  const { requests, resolveMany } = useSignApproval({ approval, resolveApproval, rejectApproval })

  useEffect(() => {
    if (!getUiType().isNotification) return

    // Be aware, that this window listener might not get trigger on all
    // browsers. The `rejectApproval` gets triggered on Chrome, even  without
    // this listener. But it might be needed for other browsers or use-cases.
    window.addEventListener('beforeunload', rejectApproval)

    return () => window.removeEventListener('beforeunload', rejectApproval)
  }, [rejectApproval])

  useEffect(() => {
    ;(async () => {
      if (getUiType().isNotification) {
        const currentApproval = await getApproval()
        setApproval(currentApproval)
      }

      setHasCheckedForApprovalInitially(true)
    })()
  }, [
    getApproval,
    // Re-get the approval since when the vault is locked and then unlocked -
    // the approval data changes. Use case: extension is locked, user is
    // authenticated, dApp requests something, user unlocks the extension.
    vaultStatus,
    // Re-get the approval since when there are no accounts and then - the user
    // adds an account (and therefore - authenticates) - the approval data changes
    authStatus
  ])

  return (
    <ExtensionApprovalContext.Provider
      value={useMemo(
        () => ({
          approval,
          requests,
          hasCheckedForApprovalInitially,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany
        }),
        [
          approval,
          requests,
          hasCheckedForApprovalInitially,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany
        ]
      )}
    >
      {children}
    </ExtensionApprovalContext.Provider>
  )
}

export { ExtensionApprovalProvider, ExtensionApprovalContext }
