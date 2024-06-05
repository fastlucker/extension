import {
  AbiCoder,
  Block,
  ethers,
  JsonRpcProvider,
  TransactionReceipt,
  TransactionResponse
} from 'ethers'
import { useEffect, useState } from 'react'

import { ERC_4337_ENTRYPOINT } from '@ambire-common/consts/deploy'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Network } from '@ambire-common/interfaces/network'
import { Storage } from '@ambire-common/interfaces/storage'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import { callsHumanizer } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
import { getExplorerId } from '@ambire-common/libs/userOperation/userOperation'
import { Bundler } from '@ambire-common/services/bundlers/bundler'
import { fetchUserOp } from '@ambire-common/services/explorers/jiffyscan'
import { handleOpsInterface } from '@benzin/screens/BenzinScreen/constants/humanizerInterfaces'
import { ActiveStepType, FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { UserOperation } from '@benzin/screens/BenzinScreen/interfaces/userOperation'
import { isExtension } from '@web/constants/browserapi'

import { parseLogs } from './utils/parseLogs'
import reproduceCalls, { getSender } from './utils/reproduceCalls'

const REFETCH_TXN_TIME = 4000 // 3.5 seconds
const REFETCH_RECEIPT_TIME = 5000 // 5 seconds
const REFETCH_JIFFY_SCAN_TIME = 10000 // 10 seconds as jiffy scan is a bit slower

interface Props {
  txnId: string | null
  userOpHash: string | null
  network?: Network
  standardOptions: {
    storage: Storage
    fetch: any
    emitError: (e: ErrorRef) => number
    parser: Function
  }
  setActiveStep: (step: ActiveStepType) => void
  provider: JsonRpcProvider | null
}

export interface StepsData {
  nativePrice: number
  blockData: null | Block
  finalizedStatus: FinalizedStatusType
  cost: null | string
  calls: IrCall[] | null
  pendingTime: number
  userOpStatusData: { status: null | string; txnId: null | string }
  txnId: string | null
  from: string | null
}

// if the transaction hash is found, we make the top url the real txn id
// because user operation hashes are not reliable long term
const setUrlToTxnId = (transactionHash: string, userOpHash: string, network: string) => {
  const splitUrl = (window.location.href || '').split('?')
  const search = splitUrl[1]
  const searchParams = new URLSearchParams(search)
  const isInternal = typeof searchParams.get('isInternal') === 'string'

  window.history.pushState(
    null,
    '',
    `${splitUrl[0]}?txnId=${transactionHash}&userOpHash=${userOpHash}&networkId=${network}${
      isInternal ? '&isInternal' : ''
    }`
  )
}

const useSteps = ({
  txnId,
  userOpHash,
  network,
  standardOptions,
  setActiveStep,
  provider
}: Props): StepsData => {
  const [nativePrice, setNativePrice] = useState<number>(0)
  const [txn, setTxn] = useState<null | TransactionResponse>(null)
  const [userOpStatusData, setUserOpStatusData] = useState<{
    status: null | string
    txnId: null | string
  }>({
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
  const [refetchUserOpStatusCounter, setRefetchUserOpStatusCounter] = useState<number>(0)
  const [refetchTxnCounter, setRefetchTxnCounter] = useState<number>(0)
  const [refetchReceiptCounter, setRefetchReceiptCounter] = useState<number>(0)
  const [cost, setCost] = useState<null | string>(null)
  const [calls, setCalls] = useState<null | IrCall[]>(null)
  const [pendingTime, setPendingTime] = useState<number>(30)
  const [userOp, setUserOp] = useState<null | UserOperation>(null)

  // if we have a userOpHash only, try to find the txnId
  useEffect(() => {
    if (!userOpHash || txnId || userOpStatusData.txnId || !network) return

    // implement the bundler fetch here, why not
    // and only listen for txIds
    Bundler.getStatusAndTxnId(userOpHash, network)
      .then((bundlerResult) => {
        if (bundlerResult.transactionHash && !userOpStatusData.txnId) {
          setUserOpStatusData({
            status: 'submitted',
            txnId: bundlerResult.transactionHash
          })
          setActiveStep('in-progress')
          setUrlToTxnId(bundlerResult.transactionHash, userOpHash, network.id)
        }
      })
      .catch((e) => e)

    fetchUserOp(userOpHash, standardOptions.fetch, getExplorerId(network))
      .then((reqRes: any) => {
        if (reqRes.status !== 200) {
          setTimeout(() => {
            setRefetchUserOpStatusCounter(refetchUserOpStatusCounter + 1)
          }, REFETCH_JIFFY_SCAN_TIME)
          return
        }

        reqRes.json().then((data: any) => {
          const userOps = data.userOps
          if (!userOps.length) {
            // if we can't find it in the next 2 minutes, we drop it
            if (refetchUserOpStatusCounter > 10) {
              setFinalizedStatus({ status: 'dropped' })
              setActiveStep('finalized')
              setUserOpStatusData({ status: 'not_found', txnId: null })
              return
            }

            setTimeout(() => {
              setRefetchUserOpStatusCounter(refetchUserOpStatusCounter + 1)
            }, REFETCH_JIFFY_SCAN_TIME)
            return
          }

          // if the txnId has already been found by the bundler,
          // do not change the state
          if (userOpStatusData.txnId) return

          const foundUserOp = userOps[0]
          if (foundUserOp.transactionHash) {
            setUserOpStatusData({
              status: 'submitted',
              txnId: foundUserOp.transactionHash
            })
            setActiveStep('in-progress')
            setUrlToTxnId(foundUserOp.transactionHash, userOpHash, network.id)
          }
        })
      })
      .catch((e) => e)
  }, [
    userOpHash,
    standardOptions,
    refetchUserOpStatusCounter,
    network,
    setActiveStep,
    txnId,
    userOpStatusData
  ])

  // find the transaction
  useEffect(() => {
    if (txn || (!txnId && !userOpStatusData.txnId) || !provider) return

    const finalTxnId = userOpStatusData.txnId ?? txnId
    provider
      .getTransaction(finalTxnId!)
      .then((fetchedTxn: null | TransactionResponse) => {
        if (!fetchedTxn) {
          // try to refetch 10 times; if it fails, mark it as dropped
          if (refetchTxnCounter < 10) {
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
  }, [txnId, userOpStatusData, txn, refetchTxnCounter, setActiveStep, provider])

  useEffect(() => {
    if (txnReceipt.blockNumber || (!txnId && !userOpStatusData.txnId) || !provider) return

    const finalTxnId = userOpStatusData.txnId ?? txnId
    provider
      .getTransactionReceipt(finalTxnId!)
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
          from: txn ? getSender(txn, receipt) : receipt.from,
          actualGasCost: receipt.gasUsed * receipt.gasPrice,
          blockNumber: BigInt(receipt.blockNumber)
        })

        let userOpsLength = 0
        if (!userOpHash && txn) {
          try {
            const handleOpsData = handleOpsInterface.decodeFunctionData('handleOps', txn.data)
            userOpsLength = handleOpsData[0].length
          } catch (e: any) {
            /* silence is bitcoin */
          }
        }

        const userOpLog = parseLogs(receipt.logs, userOpHash ?? '', userOpsLength)
        if (userOpLog && !userOpLog.success) {
          setFinalizedStatus({
            status: 'failed',
            reason: 'Inner calls failed'
          })
        } else {
          setFinalizedStatus(receipt.status ? { status: 'confirmed' } : { status: 'failed' })
        }
        setActiveStep('finalized')
      })
      .catch(() => null)
  }, [
    txnId,
    txnReceipt,
    txn,
    refetchReceiptCounter,
    setActiveStep,
    userOpHash,
    userOpStatusData.txnId,
    provider
  ])

  // check for error reason
  useEffect(() => {
    if (
      !txn ||
      (finalizedStatus && finalizedStatus.status !== 'failed') ||
      (finalizedStatus && finalizedStatus.reason) ||
      !provider
    )
      return

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
  }, [provider, txn, finalizedStatus])

  // calculate pending time
  useEffect(() => {
    if (!txn || txnReceipt.blockNumber || !provider || !network) return

    provider
      .getBlock('latest', true)
      .then((latestBlockData) => {
        if (!latestBlockData) return

        const gasPrice = txn.maxFeePerGas ?? txn.gasPrice
        if (network.feeOptions.is1559 && latestBlockData.baseFeePerGas != null) {
          setPendingTime(gasPrice > latestBlockData.baseFeePerGas ? 30 : 300)
        } else {
          const prices = latestBlockData.prefetchedTransactions
            .map((x) => x.gasPrice)
            .filter((x) => x > 0)

          if (prices.length === 0) {
            setPendingTime(30)
            return
          }

          const average = prices.reduce((a, b) => a + b, 0n) / BigInt(prices.length)
          setPendingTime(average - average / 8n > gasPrice ? 30 : 300)
        }
      })
      .catch(() => null)
  }, [txn, txnReceipt, provider, network])

  // get block
  useEffect(() => {
    if (!txnReceipt.blockNumber || blockData !== null || !provider) return

    provider
      .getBlock(Number(txnReceipt.blockNumber))
      .then((fetchedBlockData) => {
        setBlockData(fetchedBlockData)
      })
      .catch(() => null)
  }, [provider, txnReceipt, blockData])

  useEffect(() => {
    if (!network) return

    getNativePrice(network, fetch)
      .then((fetchedPrice) => setNativePrice(parseFloat(fetchedPrice.toFixed(2))))
      .catch(() => setNativePrice(0))
  }, [network])

  // if it's an user op,
  // we need to call the entry point to fetch the hashes
  // and find the matching hash
  // only after pass to reproduce calls
  useEffect(() => {
    if (!userOpHash || !network || !txn || userOp) return

    const handleOpsData = handleOpsInterface.decodeFunctionData('handleOps', txn.data)
    const userOperations = handleOpsData[0]
    let hashFound = false
    userOperations.forEach((opArray: any) => {
      // THE PACKING
      const sender = opArray[0]
      const nonce = opArray[1]
      const hashInitCode = ethers.keccak256(opArray[2])
      const hashCallData = ethers.keccak256(opArray[3])
      const callGasLimit = opArray[4]
      const verificationGasLimit = opArray[5]
      const preVerificationGas = opArray[6]
      const maxFeePerGas = opArray[7]
      const maxPriorityFeePerGas = opArray[8]
      const hashPaymasterAndData = ethers.keccak256(opArray[9])
      const abiCoder = new AbiCoder()
      const packed = abiCoder.encode(
        [
          'address',
          'uint256',
          'bytes32',
          'bytes32',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'bytes32'
        ],
        [
          sender,
          nonce,
          hashInitCode,
          hashCallData,
          callGasLimit,
          verificationGasLimit,
          preVerificationGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          hashPaymasterAndData
        ]
      )
      // END THE PACKING

      const hash = ethers.keccak256(packed)
      const finalHash = ethers.keccak256(
        abiCoder.encode(
          ['bytes32', 'address', 'uint256'],
          [hash, ERC_4337_ENTRYPOINT, network.chainId]
        )
      )

      if (finalHash.toLowerCase() === userOpHash.toLowerCase()) {
        hashFound = true
        setUserOp({
          sender,
          callData: opArray[3],
          hashStatus: 'found'
        })
      }
    })
    if (!hashFound) {
      setUserOp({
        sender: '',
        callData: '',
        hashStatus: 'not_found'
      })
    }
  }, [network, txn, userOpHash, userOp])

  useEffect(() => {
    if (userOpHash && !userOp) return
    if (calls) return

    if (network && txnReceipt.from && txn) {
      setCost(ethers.formatEther(txnReceipt.actualGasCost!.toString()))
      const accountOp: AccountOp = {
        accountAddr: txnReceipt.from!,
        networkId: network.id,
        signingKeyAddr: txnReceipt.from!, // irrelevant
        signingKeyType: 'internal', // irrelevant
        nonce: BigInt(0), // irrelevant
        calls: reproduceCalls(txn, userOp),
        gasLimit: Number(txn.gasLimit),
        signature: '0x', // irrelevant
        gasFeePayment: null,
        accountOpToExecuteBefore: null
      }
      callsHumanizer(
        accountOp,
        standardOptions.storage,
        standardOptions.fetch,
        (humanizedCalls) => standardOptions.parser(humanizedCalls, setCalls),
        standardOptions.emitError,
        { isExtension, noAsyncOperations: true }
      ).catch((e) => {
        if (!calls) setCalls([])
        return e
      })
    }
  }, [network, txnReceipt, txn, userOpHash, standardOptions, userOp, calls])

  return {
    nativePrice,
    blockData,
    finalizedStatus,
    cost,
    calls,
    pendingTime,
    userOpStatusData,
    txnId: userOpStatusData.txnId ?? txnId,
    from: userOp?.sender || txn?.from || txnReceipt.from
  }
}

export default useSteps
