import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import { Bundle } from 'adex-protocol-eth/js'
import { Wallet } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert } from 'react-native'

import CONFIG from '@config/env'
import i18n from '@config/localization/localization'
import accountPresets from '@modules/common/constants/accountPresets'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'
import { getProvider } from '@modules/common/services/provider'
import { toBundleTxn } from '@modules/common/services/requestToBundleTxn'
import {
  getFeePaymentConsequences,
  isTokenEligible
} from '@modules/pending-transactions/services/helpers'

const DEFAULT_SPEED = 'fast'
const REESTIMATE_INTERVAL = 15000
const REJECT_MSG = 'Ambire user rejected the request'

const ERC20 = new Interface(erc20Abi)

function makeBundle(account: any, networkId: any, requests: any) {
  const bundle = new Bundle({
    network: networkId,
    identity: account.id,
    txns: requests.map(({ txn }: any) => toBundleTxn(txn, account.id)),
    signer: account.signer
  })
  bundle.extraGas = requests.map((x: any) => x.extraGas || 0).reduce((a: any, b: any) => a + b, 0)
  bundle.requestIds = requests.map((x: any) => x.id)
  return bundle
  return null
}

function getErrorMessage(e: any) {
  if (e && e.message === 'NOT_TIME') {
    return "Your 72 hour recovery waiting period still hasn't ended. You will be able to use your account after this lock period."
  }
  if (e && e.message === 'WRONG_ACC_OR_NO_PRIV') {
    return 'Unable to sign with this email/password account. Please contact support.'
  }
  if (e && e.message === 'INVALID_SIGNATURE') {
    return 'Invalid signature. This may happen if you used password/derivation path on your hardware wallet.'
  }
  return e.message || e
}

const useSendTransaction = () => {
  const [estimation, setEstimation] = useState<any>(null)
  const [signingStatus, setSigningStatus] = useState<any>(false)
  const [feeSpeed, setFeeSpeed] = useState<any>(DEFAULT_SPEED)
  const { addToast } = useToast()
  const { network }: any = useNetwork()
  const { account } = useAccounts()
  const { onBroadcastedTxn, setSendTxnState, resolveMany, sendTxnState, eligibleRequests } =
    useRequests()

  // TODO: implement the related functionality
  const [replaceTx, setReplaceTx] = useState(false)

  const bundle = useMemo(
    () => sendTxnState.replacementBundle || makeBundle(account, network?.id, eligibleRequests),
    [sendTxnState?.replacementBundle, network?.id, account, eligibleRequests]
  )

  useEffect(() => {
    if (!bundle?.txns?.length) return
    setEstimation(null)
  }, [bundle, setEstimation])

  // Estimate the bundle & reestimate periodically
  const currentBundle = useRef(null)
  currentBundle.current = bundle

  useEffect(() => {
    // We don't need to reestimate the fee when a signing process is in progress
    if (signingStatus) return
    // nor when there are no txns in the bundle, if this is even possible
    if (!bundle.txns.length) return

    // track whether the effect has been unmounted
    let unmounted = false

    const reestimate = () =>
      (CONFIG.RELAYER_URL
        ? bundle.estimate({
            relayerURL: CONFIG.RELAYER_URL,
            fetch,
            replacing: !!bundle.minFeeInUSDPerGas,
            getNextNonce: true
          })
        : bundle.estimateNoRelayer({ provider: getProvider(network.id) })
      )
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .then((estimation: any) => {
          if (unmounted || bundle !== currentBundle.current) return
          // eslint-disable-next-line no-param-reassign
          estimation.selectedFeeToken = { symbol: network.nativeAssetSymbol }
          setEstimation((prevEstimation: any) => {
            if (prevEstimation && prevEstimation.customFee) return prevEstimation
            if (estimation.remainingFeeTokenBalances) {
              // If there's no eligible token, set it to the first one cause it looks more user friendly (it's the preferred one, usually a stablecoin)
              // eslint-disable-next-line no-param-reassign
              estimation.selectedFeeToken =
                (prevEstimation &&
                  isTokenEligible(prevEstimation.selectedFeeToken, feeSpeed, estimation) &&
                  prevEstimation.selectedFeeToken) ||
                estimation.remainingFeeTokenBalances.find((token: any) =>
                  isTokenEligible(token, feeSpeed, estimation)
                ) ||
                estimation.remainingFeeTokenBalances[0]
            }
            return estimation
          })
          if (estimation.nextNonce && !estimation.nextNonce.pendingBundle) {
            setReplaceTx(false)
          }
        })
        .catch((e: any) => {
          if (unmounted) return
          addToast(`Estimation error: ${e.message || e}`, { error: true })
        })

    reestimate()
    const intvl = setInterval(reestimate, REESTIMATE_INTERVAL)

    return () => {
      unmounted = true
      clearInterval(intvl)
    }
  }, [
    bundle,
    setEstimation,
    feeSpeed,
    addToast,
    network,
    CONFIG.RELAYER_URL,
    signingStatus,
    replaceTx,
    setReplaceTx
  ])

  // The final bundle is used when signing + sending it
  // the bundle before that is used for estimating
  const getFinalBundle = useCallback(() => {
    if (!CONFIG.RELAYER_URL) {
      return new Bundle({
        ...bundle,
        gasLimit: estimation.gasLimit
      })
    }

    const feeToken = estimation.selectedFeeToken
    const { addedGas, multiplier } = getFeePaymentConsequences(feeToken, estimation)
    const toHexAmount = (amnt: any) => `0x${Math.round(amnt).toString(16)}`
    const feeTxn =
      feeToken.symbol === network.nativeAssetSymbol
        ? [
            accountPresets.feeCollector,
            toHexAmount(estimation.feeInNative[feeSpeed] * multiplier * 1e18),
            '0x'
          ]
        : [
            feeToken.address,
            '0x0',
            ERC20.encodeFunctionData('transfer', [
              accountPresets.feeCollector,
              toHexAmount(
                (feeToken.isStable
                  ? estimation.feeInUSD[feeSpeed]
                  : estimation.feeInNative[feeSpeed]) *
                  multiplier *
                  10 ** feeToken.decimals
              )
            ])
          ]

    const pendingBundle = estimation.nextNonce?.pendingBundle
    const nextFreeNonce = estimation.nextNonce?.nonce
    const nextNonMinedNonce = estimation.nextNonce?.nextNonMinedNonce

    return new Bundle({
      ...bundle,
      txns: [...bundle.txns, feeTxn],
      gasLimit: estimation.gasLimit + addedGas + (bundle.extraGas || 0),
      nonce: replaceTx && pendingBundle ? nextNonMinedNonce : nextFreeNonce
    })
  }, [CONFIG.RELAYER_URL, bundle, estimation, feeSpeed, network.nativeAssetSymbol, replaceTx])

  const approveTxnImplQuickAcc = async ({ quickAccCredentials }: any) => {
    if (!estimation) throw new Error('no estimation: should never happen')
    if (!CONFIG.RELAYER_URL)
      throw new Error('Email/Password account signing without the relayer is not supported yet')

    const finalBundle = (signingStatus && signingStatus.finalBundle) || getFinalBundle()
    const signer = finalBundle.signer

    if (typeof finalBundle.nonce !== 'number') {
      await finalBundle.getNonce(getProvider(network.id))
    }

    const { signature, success, message, confCodeRequired } = await fetchPost(
      `${CONFIG.RELAYER_URL}/second-key/${bundle.identity}/${network.id}/sign`,
      {
        signer,
        txns: finalBundle.txns,
        nonce: finalBundle.nonce,
        gasLimit: finalBundle.gasLimit,
        code: quickAccCredentials && quickAccCredentials.code,
        // This can be a boolean but it can also contain the new signer/primaryKeyBackup, which instructs /second-key to update acc upon successful signature
        recoveryMode: finalBundle.recoveryMode
      }
    )
    if (!success) {
      if (!message) throw new Error('Secondary key: no success but no error message')
      if (message.includes('invalid confirmation code')) {
        addToast(i18n.t('Unable to sign: wrong confirmation code') as string, { error: true })
        return
      }
      throw new Error(`Secondary key error: ${message}`)
    }
    if (confCodeRequired) {
      setSigningStatus({ quickAcc: true, finalBundle, confCodeRequired })
    } else {
      if (!signature) throw new Error('QuickAcc internal error: there should be a signature')
      if (!account.primaryKeyBackup)
        throw new Error(
          'No key backup found: you need to import the account from JSON or login again.'
        )
      setSigningStatus({ quickAcc: true, inProgress: true })
      if (!finalBundle.recoveryMode) {
        // Make sure we let React re-render without blocking (decrypting and signing will block)
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 0))
        const pwd = quickAccCredentials.password || Alert.alert('Enter password')
        const wallet = await Wallet.fromEncryptedJson(JSON.parse(account.primaryKeyBackup), pwd)
        await finalBundle.sign(wallet)
      } else {
        // set both .signature and .signatureTwo to the same value: the secondary signature
        // this will trigger a timelocked txn
        finalBundle.signature = signature
      }
      finalBundle.signatureTwo = signature
      // eslint-disable-next-line @typescript-eslint/return-await
      return await finalBundle.submit({ relayerURL: CONFIG.RELAYER_URL, fetch })
    }
  }

  const approveTxn = ({ quickAccCredentials }: any) => {
    if (signingStatus && signingStatus.inProgress) return
    setSigningStatus(signingStatus || { inProgress: true })

    if (account.signerExtra && account.signerExtra.type === 'ledger') {
      addToast(i18n.t('Please confirm this transaction on your Ledger device.') as string, {
        timeout: 10000
      })
    }

    const requestIds = bundle.requestIds
    const approveTxnPromise = approveTxnImplQuickAcc({ quickAccCredentials })
    approveTxnPromise
      .then((bundleResult) => {
        // special case for approveTxnImplQuickAcc
        if (!bundleResult) return

        // be careful not to call this after onDimiss, cause it might cause state to be changed post-unmount
        setSigningStatus(null)

        // Inform everything that's waiting for the results (eg WalletConnect)
        const skipResolve =
          !bundleResult.success &&
          bundleResult.message &&
          bundleResult.message.match(/underpriced/i)
        if (!skipResolve && requestIds)
          resolveMany(requestIds, {
            success: bundleResult.success,
            result: bundleResult.txId,
            message: bundleResult.message
          })

        if (bundleResult.success) {
          onBroadcastedTxn(bundleResult.txId)
          setSendTxnState({ showing: false })
        } else addToast(`Transaction error: ${getErrorMessage(bundleResult)}`, { error: true }) // 'unspecified error'
      })
      .catch((e) => {
        setSigningStatus(null)
        if (e && e.message.includes('must provide an Ethereum address')) {
          addToast(
            i18n.t(
              "Signing error: not connected with the correct address. Make sure you're connected with {{address}}.",
              { address: bundle.signer.address }
            ) as string,
            { error: true }
          )
        } else if (e && e.message.includes('0x6b0c')) {
          // not sure if that's actually the case with this hellish error, but after unlocking the device it no longer appeared
          // however, it stopped appearing after that even if the device is locked, so I'm not sure it's related...
          addToast(
            i18n.t(
              'Ledger: unknown error (0x6b0c): is your Ledger unlocked and in the Ethereum application?'
            ) as string,
            { error: true }
          )
        } else {
          addToast(`Signing error: ${getErrorMessage(e)}`, { error: true })
        }
      })
  }

  // Not applicable when .requestIds is not defined (replacement bundle)
  const rejectTxn =
    bundle.requestIds &&
    (() => {
      setSendTxnState({ showing: false })
      resolveMany(bundle.requestIds, { message: REJECT_MSG })
    })

  return {
    bundle,
    rejectTxn,
    estimation,
    signingStatus,
    feeSpeed,
    approveTxn,
    setFeeSpeed,
    setEstimation
  }
}

export default useSendTransaction
