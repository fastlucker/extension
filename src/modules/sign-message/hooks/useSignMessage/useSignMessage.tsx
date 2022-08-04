import { Bundle, signMessage, signMessage712 } from 'adex-protocol-eth/js/Bundle'
import accountPresets from 'ambire-common/src/constants/accountPresets'
import { getProvider } from 'ambire-common/src/services/provider'
import { Wallet } from 'ethers'
import {
  _TypedDataEncoder,
  AbiCoder,
  arrayify,
  isHexString,
  keccak256,
  toUtf8Bytes
} from 'ethers/lib/utils'
import { useCallback, useEffect, useState } from 'react'

import { verifyMessage } from '@ambire/signature-validator'
import CONFIG from '@config/env'
import i18n from '@config/localization/localization'
import { UseBottomSheetReturnType } from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'
import { getWallet } from '@modules/common/services/getWallet/getWallet'
import { navigate } from '@modules/common/services/navigation'
import { getNetworkByChainId } from '@modules/sign-message/services/getNetwork'

export type QuickAccBottomSheetType = {
  sheetRef: any
  openBottomSheet: UseBottomSheetReturnType['openBottomSheet']
  closeBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
  isOpen: boolean
}

export type HardwareWalletBottomSheetType = {
  sheetRef: any
  openBottomSheet: UseBottomSheetReturnType['openBottomSheet']
  closeBottomSheet: UseBottomSheetReturnType['closeBottomSheet']
  isOpen: boolean
}

function getMessageAsBytes(msg: string) {
  // Transforming human message / hex string to bytes
  if (!isHexString(msg)) {
    return toUtf8Bytes(msg)
  }
  return arrayify(msg)
}

const useSignMessage = (
  quickAccBottomSheet: QuickAccBottomSheetType,
  hardwareWalletBottomSheet: HardwareWalletBottomSheetType
) => {
  const { addToast } = useToast()
  const { account } = useAccounts()
  const { everythingToSign, resolveMany } = useRequests()
  const { network } = useNetwork()
  const toSign = everythingToSign[0] || {}
  const totalRequests = everythingToSign?.length
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isDeployed, setIsDeployed] = useState<null | boolean>(null)
  const [hasPrivileges, setHasPrivileges] = useState<null | boolean>(null)
  const [hasProviderError, setHasProviderError] = useState(null)
  const [confirmationType, setConfirmationType] = useState(null)

  let typeDataErr
  let dataV4: any
  const requestedChainId = toSign.chainId
  const isTypedData = ['eth_signTypedData_v4', 'eth_signTypedData'].indexOf(toSign?.type) !== -1
  if (isTypedData) {
    dataV4 = toSign.txn
    if (typeof dataV4 === 'object' && dataV4 !== null) {
      try {
        if (dataV4?.types?.EIP712Domain) {
          // Avoids failure in case some dapps explicitly add this (redundant) prop
          delete dataV4?.types?.EIP712Domain
        }
        _TypedDataEncoder.hash(dataV4?.domain, dataV4.types, dataV4?.message)
      } catch {
        typeDataErr = '.txn has Invalid TypedData object. Should be {domain, types, message}'
      }
    } else {
      typeDataErr = '.txn should be a TypedData object'
    }
  }

  const requestedNetwork = getNetworkByChainId(requestedChainId)

  const checkIsDeployedAndHasPrivileges = useCallback(async () => {
    if (!requestedNetwork) return

    const bundle = new Bundle({
      network: network?.id,
      identity: account?.id,
      signer: account?.signer
    })

    const provider = await getProvider(network?.id)

    let privilegeAddress: any
    let quickAccAccountHash: any
    if (account?.signer?.quickAccManager) {
      const { quickAccTimelock } = accountPresets
      const quickAccountTuple = [quickAccTimelock, account?.signer?.one, account?.signer?.two]
      const abiCoder = new AbiCoder()
      quickAccAccountHash = keccak256(
        abiCoder.encode(['tuple(uint, address, address)'], [quickAccountTuple])
      )
      privilegeAddress = account.signer?.quickAccManager
    } else {
      privilegeAddress = account.signer?.address
    }

    // to differenciate reverts and network issues
    const callObject = {
      method: 'eth_call',
      params: [
        {
          to: bundle.identity,
          data: `0xc066a5b1000000000000000000000000${privilegeAddress.toLowerCase().substring(2)}`
        },
        'latest'
      ],
      id: 1,
      jsonrpc: '2.0'
    }

    fetchPost(provider?.connection?.url, callObject)
      .then((result: any) => {
        if (result.result && result.result !== '0x') {
          setIsDeployed(true)
          if (account?.signer?.quickAccManager) {
            setHasPrivileges(result.result === quickAccAccountHash)
          } else {
            // TODO: To ask : in what cases it's more than 1?
            // eslint-disable-next-line no-lonely-if
            if (
              result.result === '0x0000000000000000000000000000000000000000000000000000000000000001'
            ) {
              setHasPrivileges(true)
            } else {
              setHasPrivileges(false)
            }
          }
        } else {
          // result.error or anything else that does not have a .result prop, we assume it is not deployed
          setIsDeployed(false)
        }
      })
      .catch((err) => {
        // as raw XHR calls, reverts are not caught, but only have .error prop
        // this should be a netowrk error
        setHasProviderError(err.message)
      })
  }, [account, network, requestedNetwork])

  useEffect(() => {
    checkIsDeployedAndHasPrivileges()
  }, [checkIsDeployedAndHasPrivileges])

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

  const verifySignature = (toSign, sig, networkId) => {
    const provider = getProvider(networkId)
    return verifyMessage({
      provider,
      signer: account.id,
      message: isTypedData ? null : getMessageAsBytes(toSign.txn),
      typedData: isTypedData ? dataV4 : null,
      signature: sig
    })
      .then((verificationResult: any) => {
        if (verificationResult) {
          addToast(`${toSign.type} SIGNATURE VALID`)
        } else {
          addToast(`${toSign.type} SIGNATURE INVALID`, { error: true })
        }
      })
      .catch((e: any) => {
        addToast(`${toSign.type} SIGNATURE INVALID: ${e.message}`, { error: true })
      })
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
      const { signature, success, message, confCodeRequired } = await fetchPost(
        // network doesn't matter when signing
        // if it does tho, we can use ${network.id}
        `${CONFIG.RELAYER_URL}/second-key/${account.id}/ethereum/sign${
          isTypedData ? '?typedData=true' : ''
        }`,
        {
          toSign: toSign.txn,
          code: credentials.code?.length ? credentials.code : undefined
        }
      )
      if (!success) {
        setLoading(false)
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
        setLoading(false)
        setConfirmationType(confCodeRequired)
        quickAccBottomSheet.openBottomSheet()

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
      const sig = await (isTypedData
        ? signMessage712(
            wallet,
            account.id,
            account.signer,
            dataV4.domain,
            dataV4.types,
            dataV4.message,
            signature
          )
        : signMessage(wallet, account.id, account.signer, getMessageAsBytes(toSign.txn), signature))

      await verifySignature(toSign, sig, requestedNetwork?.id)

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

  const approve = async (credentials: any, device: any) => {
    if (account.signer?.quickAccManager) {
      await approveQuickAcc(credentials)
      return
    }

    setLoading(true)

    try {
      if (!hardwareWalletBottomSheet.isOpen && !device) {
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
        device
      )
      // It would be great if we could pass the full data cause then web3 wallets/hw wallets can display the full text
      // Unfortunately that isn't possible, because isValidSignature only takes a bytes32 hash; so to sign this with
      // a personal message, we need to be signing the hash itself as binary data such that we match 'Ethereum signed message:\n32<hash binary data>' on the contract

      const sig = await (toSign.type === 'eth_signTypedData_v4' ||
      toSign.type === 'eth_signTypedData'
        ? signMessage712(
            wallet,
            account.id,
            account.signer,
            dataV4.domain,
            dataV4.types,
            dataV4.message
          )
        : signMessage(wallet, account.id, account.signer, getMessageAsBytes(toSign.txn)))

      await verifySignature(toSign, sig, requestedNetwork?.id)

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
    resolve,
    confirmationType,
    hasPrivileges,
    hasProviderError,
    toSign,
    totalRequests,
    typeDataErr,
    isDeployed,
    dataV4
  }
}

export default useSignMessage
