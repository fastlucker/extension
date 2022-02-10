import { signMsgHash } from 'adex-protocol-eth/js/Bundle'
import { Wallet } from 'ethers'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { useState } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'

const useSignMessage = () => {
  const { addToast } = useToast()
  const { account } = useAccounts()
  const { everythingToSign, resolveMany } = useRequests()
  const toSign = everythingToSign[0]

  const [isLoading, setLoading] = useState<boolean>(false)

  const resolve = (outcome: any) => resolveMany([everythingToSign[0].id], outcome)

  const handleSigningErr = (e: any) => {
    console.error('Signing error', e)
    if (e && e.message.includes('must provide an Ethereum address')) {
      addToast(
        `Signing error: not connected with the correct address. Make sure you're connected with ${account.signer?.address}.`,
        { error: true }
      )
    } else {
      addToast(`Signing error: ${e.message || e}`, { error: true })
    }
  }

  const approveQuickAcc = async (credentials: any, confirmationCode?: any) => {
    if (!CONFIG.RELAYER_URL) {
      addToast('Email/pass accounts not supported without a relayer connection', { error: true })
      return
    }
    if (!credentials.password) {
      addToast('Password required to unlock the account', { error: true })
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
          code: confirmationCode
        }
      )
      if (!success) {
        if (!message) throw new Error('Secondary key: no success but no error message')
        if (message.includes('invalid confirmation code')) {
          addToast('Unable to sign: wrong confirmation code', { error: true })
        }
        addToast(`Second signature error: ${message}`, { error: true })
        return
      }
      if (confCodeRequired) {
        // TODO:
        // const confCode = prompt(
        //   'A confirmation code has been sent to your email, it is valid for 3 minutes. Please enter it here:'
        // )
        const confCode = null
        if (!confCode) throw new Error('You must enter a confirmation code')
        await approveQuickAcc(credentials, confCode)
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
      addToast('Successfully signed!')
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
    isLoading,
    resolve
  }
}

export default useSignMessage
