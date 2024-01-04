import { Block, ethers, TransactionReceipt, TransactionResponse } from 'ethers'
import { useEffect, useState } from 'react'

import humanizerJSON from '@ambire-common/consts/humanizerInfo.json'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { humanizeCalls } from '@ambire-common/libs/humanizer/humanizerFuncs'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { parseCalls } from '@ambire-common/libs/humanizer/parsers'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
import bundler from '@ambire-common/services/bundlers'
import { Bundler } from '@ambire-common/services/bundlers/bundler'
import { ActiveStepType, FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'

import humanizerModules from './utils/humanizerModules'
import parsingModules from './utils/parsingModules'
import reproduceCalls from './utils/reproduceCalls'

const REFETCH_TXN_TIME = 3500 // 3.5 seconds
const REFETCH_RECEIPT_TIME = 10000 // 10 seconds

interface Props {
  txnId: string
  network: NetworkDescriptor
  isUserOp: boolean
  standardOptions: {
    fetch: any
    emitError: (e: ErrorRef) => number
  }
  setActiveStep: (step: ActiveStepType) => void
}

export interface StepsData {
  nativePrice: number
  blockData: null | Block
  finalizedStatus: FinalizedStatusType
  cost: null | string
  calls: IrCall[]
}

const useSteps = ({
  txnId,
  network,
  isUserOp,
  standardOptions,
  setActiveStep
}: Props): StepsData => {
  const [nativePrice, setNativePrice] = useState<number>(0)
  const [txn, setTxn] = useState<null | TransactionResponse>(null)
  const [userOp, setUserOp] = useState<{ status: null | string; txnId: null | string }>({
    status: null,
    txnId: null
  })
  const [txnReceipt, setTxnReceipt] = useState<{
    actualGasCost: null | BigInt
    from: null | string
    blockNumber: null | BigInt
  }>({ actualGasCost: null, from: null, blockNumber: null })
  const [blockData, setBlockData] = useState<null | Block>(null)
  const [finalizedStatus, setFinalizedStatus] = useState<FinalizedStatusType>({
    status: 'fetching'
  })
  const [refetchTxnCounter, setRefetchTxnCounter] = useState<number>(0)
  const [refetchReceiptCounter, setRefetchReceiptCounter] = useState<number>(0)
  const [cost, setCost] = useState<null | string>(null)
  const [calls, setCalls] = useState<IrCall[]>([])

  useEffect(() => {
    if (!txnId || !network || !isUserOp || userOp.status !== null || txnReceipt.blockNumber) return

    Bundler.getStatusAndTxnId(txnId, network)
      .then((userOpStatusAndId: { status: string; transactionHash: null | string }) => {
        switch (userOpStatusAndId.status) {
          case 'rejected':
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            setUserOp({ status: userOpStatusAndId.status, txnId: null })
            break

          case 'not_found':
          case 'not_submitted':
            setFinalizedStatus({ status: 'fetching' })
            setActiveStep('in-progress')
            setUserOp({ status: userOpStatusAndId.status, txnId: null })
            break

          case 'submitted':
          case 'included':
          case 'failed':
            setUserOp({
              status: userOpStatusAndId.status,
              txnId: userOpStatusAndId.transactionHash
            })
            setActiveStep('in-progress')
            break

          default:
            throw new Error('Unhandled user operation status. Please contact support')
        }
      })
      .catch(() => setUserOp({ status: 'not_found', txnId: null }))
  }, [isUserOp, userOp, network, txnId, txnReceipt, setActiveStep])

  useEffect(() => {
    if (!txnId || !network || !isUserOp || !userOp.status || txnReceipt.blockNumber) return

    bundler
      .getReceipt(txnId, network)
      .then((userOpReceipt: any) => {
        if (!userOpReceipt) {
          // if userOp.status is not found (not a recent user op)
          // and we have to receipt, it means the txn was dropped
          if (userOp.status === 'not_found') {
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            return
          }

          // rejection is handled on status level, no need to change the state
          if (userOp.status === 'rejected') {
            return
          }

          // if we have a status !== not_found | rejected, we are waiting
          // for the receipt and we try to refetch after REFETCH_RECEIPT_TIME
          setTimeout(
            () => setRefetchReceiptCounter(refetchReceiptCounter + 1),
            REFETCH_RECEIPT_TIME
          )
          return
        }

        setTxnReceipt({
          from: userOpReceipt.sender,
          actualGasCost: BigInt(userOpReceipt.actualGasCost),
          blockNumber: BigInt(userOpReceipt.receipt.blockNumber)
        })
        setUserOp({
          status: 'included',
          txnId: userOpReceipt.receipt.transactionHash
        })
        setFinalizedStatus(
          userOpReceipt.receipt.status === '0x1' ? { status: 'confirmed' } : { status: 'failed' }
        )
        setActiveStep('finalized')
      })
      .catch(() => null)
  }, [txnId, network, isUserOp, userOp, txnReceipt, refetchReceiptCounter, setActiveStep])

  useEffect(() => {
    if (!network || txn || (isUserOp && userOp.txnId === null)) return

    const finalTxnId = userOp.txnId ?? txnId
    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getTransaction(finalTxnId)
      .then((fetchedTxn: null | TransactionResponse) => {
        if (!fetchedTxn) {
          // try to refetch 3 times; if it fails, mark it as dropped
          if (refetchTxnCounter < 3) {
            setTimeout(() => {
              setRefetchTxnCounter(refetchTxnCounter + 1)
            }, REFETCH_TXN_TIME)
            return
          }

          setFinalizedStatus({ status: 'dropped' })
          setActiveStep('finalized')
          return
        }

        setTxn(fetchedTxn)
      })
      .catch(() => null)
  }, [txnId, network, userOp, isUserOp, txn, refetchTxnCounter, setActiveStep])

  useEffect(() => {
    if (!network || isUserOp || txnReceipt.blockNumber) return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getTransactionReceipt(txnId!)
      .then((receipt: null | TransactionReceipt) => {
        if (!receipt) {
          // if there is a txn but no receipt, it means it is pending
          if (txn) {
            setTimeout(
              () => setRefetchReceiptCounter(refetchReceiptCounter + 1),
              REFETCH_RECEIPT_TIME
            )
            setFinalizedStatus({ status: 'fetching' })
            setActiveStep('in-progress')
            return
          }

          // just stop the execution if txn is null because we might
          // not have fetched it, yet
          // if txn is null, logic for dropping the txn is handled there
          return
        }

        setTxnReceipt({
          from: receipt.from,
          actualGasCost: receipt.gasUsed * receipt.gasPrice,
          blockNumber: BigInt(receipt.blockNumber)
        })
        setFinalizedStatus(receipt.status ? { status: 'confirmed' } : { status: 'failed' })
        setActiveStep('finalized')
      })
      .catch(() => null)
  }, [txnId, network, isUserOp, txnReceipt, txn, refetchReceiptCounter, setActiveStep])

  // check for error reason
  useEffect(() => {
    if (
      !network ||
      !txn ||
      (finalizedStatus && finalizedStatus.status !== 'failed') ||
      (finalizedStatus && finalizedStatus.reason)
    )
      return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .call({
        to: txn.to,
        from: txn.from,
        nonce: txn.nonce,
        gasLimit: txn.gasLimit,
        gasPrice: txn.gasPrice,
        data: txn.data,
        value: txn.value,
        chainId: txn.chainId,
        type: txn.type ?? undefined,
        accessList: txn.accessList
      })
      .then(() => null)
      .catch((error: Error) => {
        if (error.message.includes('missing revert data')) {
          setFinalizedStatus({
            status: 'failed',
            reason: 'Contract execution reverted'
          })
          return
        }

        setFinalizedStatus({
          status: 'failed',
          reason:
            error.message.length > 20
              ? `${error.message.substring(0, 25)}... (open explorer for further details)`
              : error.message
        })
      })
  }, [network, txn, finalizedStatus])

  // get block
  useEffect(() => {
    if (!network || !txnReceipt.blockNumber || blockData !== null) return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getBlock(Number(txnReceipt.blockNumber))
      .then((fetchedBlockData) => {
        setBlockData(fetchedBlockData)
      })
      .catch(() => null)
  }, [network, txnReceipt, blockData])

  useEffect(() => {
    if (!network) return

    getNativePrice(network, fetch)
      .then((fetchedPrice) => setNativePrice(parseFloat(fetchedPrice.toFixed(2))))
      .catch(() => setNativePrice(0))
  }, [network])

  useEffect(() => {
    if (network && txnReceipt.from && txn) {
      setCost(ethers.formatEther(txnReceipt.actualGasCost!.toString()))
      const accountOp = {
        accountAddr: txnReceipt.from!,
        networkId: network.id,
        signingKeyAddr: txnReceipt.from!, // irrelevant
        signingKeyType: 'internal', // irrelevant
        nonce: BigInt(0), // irrelevant
        calls: reproduceCalls(txn, txnReceipt.from, isUserOp),
        gasLimit: Number(txn.gasLimit),
        signature: '0x', // irrelevant
        gasFeePayment: null,
        accountOpToExecuteBefore: null,
        humanizerMeta: humanizerJSON
      }
      const humanize = humanizeCalls(accountOp, humanizerModules, standardOptions)
      const [parsedCalls] = parseCalls(accountOp, humanize[0], parsingModules, standardOptions)
      setCalls(parsedCalls)
    }
  }, [network, txnReceipt, txn, isUserOp, standardOptions])

  return {
    nativePrice,
    blockData,
    finalizedStatus,
    cost,
    calls
  }
}

export default useSteps
