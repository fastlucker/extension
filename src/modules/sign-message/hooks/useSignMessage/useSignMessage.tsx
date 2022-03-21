import { signMsgHash } from 'adex-protocol-eth/js/Bundle'
import { Wallet } from 'ethers'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { useState } from 'react'

import CONFIG from '@config/env'
import i18n from '@config/localization/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'
import { getWallet } from '@modules/common/services/getWallet/getWallet'
import { navigate } from '@modules/common/services/navigation'

export type QuickAccBottomSheetType = {
  sheetRef: any
  openBottomSheet: any
  closeBottomSheet: any
  isOpen: any
}

export type HardwareWalletBottomSheetType = {
  sheetRef: any
  openBottomSheet: any
  closeBottomSheet: any
  isOpen: any
}

const useSignMessage = (
  quickAccBottomSheet: QuickAccBottomSheetType,
  hardwareWalletBottomSheet: HardwareWalletBottomSheetType
) => {
  const { addToast } = useToast()
  const { account } = useAccounts()
  const { everythingToSign, resolveMany } = useRequests()
  const toSign = everythingToSign[0]

  const [isLoading, setLoading] = useState<boolean>(false)

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
        quickAccBottomSheet.openBottomSheet()
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

  const approve = async (credentials: any, deviceId: any) => {
    if (account.signer?.quickAccManager) {
      await approveQuickAcc(credentials)
      return
    }

    setLoading(true)

    try {
      if (!hardwareWalletBottomSheet.isOpen && !deviceId) {
        hardwareWalletBottomSheet.openBottomSheet()
        return
      }

      // if quick account, wallet = await fromEncryptedBackup
      // and just pass the signature as secondSig to signMsgHash
      const wallet = getWallet(
        {
          signer: account.signer,
          signerExtra: account.signerExtra,
          chainId: 1 // does not matter
        },
        deviceId
      )
      // It would be great if we could pass the full data cause then web3 wallets/hw wallets can display the full text
      // Unfortunately that isn't possible, because isValidSignature only takes a bytes32 hash; so to sign this with
      // a personal message, we need to be signing the hash itself as binary data such that we match 'Ethereum signed message:\n32<hash binary data>' on the contract
      const hash = keccak256(arrayify(toSign.txn)) // hacky equivalent is: id(toUtf8String(toSign.txn))
      const sig = await signMsgHash(wallet, account.id, account.signer, arrayify(hash))
      resolve({ success: true, result: sig })
      addToast(i18n.t('Successfully signed!') as string)
    } catch (e) {
      handleSigningErr(e)
    }
    setLoading(false)
  }

  return {
    approve,
    approveQuickAcc,
    isLoading,
    resolve
  }
}

export default useSignMessage
