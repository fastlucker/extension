import { signMsgHash } from 'adex-protocol-eth/js/Bundle'
import { Wallet } from 'ethers'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { useState } from 'react'

import CONFIG from '@config/env'
import i18n from '@config/localization/localization'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'
import { navigate } from '@modules/common/services/navigation'

const useSignMessage = () => {
  const { addToast } = useToast()
  const { account } = useAccounts()
  const { everythingToSign, resolveMany } = useRequests()
  const toSign = everythingToSign[0]

  const [isLoading, setLoading] = useState<boolean>(false)

  const {
    sheetRef,
    openBottomSheet,
    closeBottomSheet,
    isOpen: isBottomSheetOpen
  } = useBottomSheet()

  const resolve = (outcome: any) => resolveMany([everythingToSign[0].id], outcome)

  const handleSigningErr = (e: any) => {
    if (e && e.message.includes('must provide an Ethereum address')) {
      addToast(
        i18n.t(
          "Signing error: not connected with the correct address. Make sure you're connected with {{address}}.",
          { address: account.signer?.address }
        ) as string,
        { error: true }
      )
    } else {
      addToast(i18n.t('Signing error: {{message}}', { message: e.message || e }) as string, {
        error: true
      })
    }
  }

  const approveQuickAcc = async (credentials: any) => {
    if (!CONFIG.RELAYER_URL) {
      addToast(i18n.t('Email/pass accounts not supported without a relayer connection') as string, {
        error: true
      })
      return
    }
    if (!credentials.password) {
      addToast(i18n.t('Password required to unlock the account') as string, { error: true })
      return
    }
    setLoading(true)
    try {
      const hash = keccak256(arrayify(toSign.txn))

      const { signature, success, message, confCodeRequired } = await fetchPost(
        // network doesn't matter when signing
        `${CONFIG.RELAYER_URL}/second-key/${account.id}/ethereum/sign`,
        {
          toSign: hash,
          code: credentials.code?.length ? credentials.code : undefined
        }
      )
      if (!success) {
        if (!message) throw new Error('Secondary key: no success but no error message')
        if (message.includes('invalid confirmation code')) {
          addToast(i18n.t('Unable to sign: wrong confirmation code') as string, { error: true })
        }
        addToast(i18n.t('Second signature error: {{message}}', { message }) as string, {
          error: true
        })
        return
      }
      if (confCodeRequired) {
        openBottomSheet()
        setLoading(false)

        return
      }

      if (!account.primaryKeyBackup)
        throw new Error(
          'No key backup found: you need to import the account from JSON or login again.'
        )
      const wallet = await Wallet.fromEncryptedJson(
        JSON.parse(account.primaryKeyBackup),
        credentials.password
      )
      const sig = await signMsgHash(wallet, account.id, account.signer, arrayify(hash), signature)
      resolve({ success: true, result: sig })
      addToast(i18n.t('Successfully signed!') as string)
      if (everythingToSign.length === 1) {
        navigate('dashboard')
      }
    } catch (e) {
      handleSigningErr(e)
    }
    setLoading(false)
  }

  const approve = async (credentials: any) => {
    if (account.signer.quickAccManager) {
      await approveQuickAcc(credentials)
    }
  }

  return {
    approve,
    approveQuickAcc,
    isLoading,
    resolve,
    closeBottomSheet,
    sheetRef,
    isBottomSheetOpen
  }
}

export default useSignMessage
