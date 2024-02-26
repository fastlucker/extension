import { AbiCoder, Block, ethers, TransactionReceipt, TransactionResponse } from 'ethers'
import { useEffect, useState } from 'react'

import { ERC_4337_ENTRYPOINT } from '@ambire-common/consts/deploy'
import humanizerJSON from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { Storage } from '@ambire-common/interfaces/storage'
import { callsHumanizer } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
import { Bundler } from '@ambire-common/services/bundlers/bundler'
import { handleOpsInterface } from '@benzin/screens/BenzinScreen/constants/humanizerInterfaces'
import { ActiveStepType, FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { UserOperation } from '@benzin/screens/BenzinScreen/interfaces/userOperation'

import { parseLogs } from './utils/parseLogs'
import reproduceCalls, { getSender } from './utils/reproduceCalls'

const REFETCH_TXN_TIME = 3500 // 3.5 seconds
const REFETCH_RECEIPT_TIME = 5000 // 5 seconds

interface Props {
  txnId: string
  userOpHash: string | null
  network: NetworkDescriptor
  isUserOp: boolean
  standardOptions: {
    storage: Storage
    fetch: any
    emitError: (e: ErrorRef) => number
    parser: Function
  }
  setActiveStep: (step: ActiveStepType) => void
}

export interface StepsData {
  nativePrice: number
  blockData: null | Block
  finalizedStatus: FinalizedStatusType
  cost: null | string
  calls: IrCall[] | null
  pendingTime: number
  userOpStatusData: { status: null | string; txnId: null | string }
}

// if the transaction hash is found, we make the top url the real txn id
// because user operation hashes are not reliable long term
const setUrlToTxnId = (transactionHash: string, userOpHash: string, network: string) => {
  const splitUrl = (window.location.href || '').split('?')
  const search = splitUrl[1]
  const searchParams = new URLSearchParams(search)
  const isInternal = searchParams.get('isInternal') !== undefined

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
  isUserOp,
  standardOptions,
  setActiveStep
}: Props): StepsData => {
  // set the user operation hash
  // txnId=0x1aac37bc62f72ca903ebecf9c2a48d116bb0b881edff3171d87a427484bdef71&networkId=avalanche
  // it is null in the above case
  // txnId=0x1aac37bc62f72ca903ebecf9c2a48d116bb0b881edff3171d87a427484bdef71&networkId=avalanche&isUserOp
  // it is the txnId in the above
  // txnId=0x1aac37bc62f72ca903ebecf9c2a48d116bb0b881edff3171d87a427484bdef71&userOpHash=0x98g65jbc62f72ca903ebecf9c2a48d116bb0b881edff3171d87a427484bdef71&networkId=avalanche&
  // it is the userOpHash in the above
  const finalUserOpHash = isUserOp ? userOpHash ?? txnId : null
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

  useEffect(() => {
    if (
      !finalUserOpHash ||
      !network ||
      !isUserOp ||
      userOpStatusData.status !== null ||
      txnReceipt.blockNumber ||
      (isUserOp && userOpHash)
    )
      return

    Bundler.getStatusAndTxnId(finalUserOpHash, network)
      .then((userOpStatusAndId: { status: string; transactionHash: null | string }) => {
        switch (userOpStatusAndId.status) {
          case 'not_found':
            if (refetchUserOpStatusCounter > 5) {
              setFinalizedStatus({ status: 'dropped' })
              setActiveStep('finalized')
              setUserOpStatusData({ status: userOpStatusAndId.status, txnId: null })
              break
            }

            // if not found, try at least 6 times (30 seconds)
            // before declaring failure
            setTimeout(() => {
              setRefetchUserOpStatusCounter(refetchUserOpStatusCounter + 1)
            }, REFETCH_RECEIPT_TIME)
            break

          case 'rejected':
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            setUserOpStatusData({ status: userOpStatusAndId.status, txnId: null })
            break

          case 'not_submitted':
            setFinalizedStatus({ status: 'fetching' })
            setActiveStep('in-progress')

            // send requests to the bundler until submitted
            setTimeout(() => {
              setRefetchUserOpStatusCounter(refetchUserOpStatusCounter + 1)
            }, REFETCH_TXN_TIME)
            break

          case 'submitted':
          case 'included':
          case 'failed':
            setUserOpStatusData({
              status: userOpStatusAndId.status,
              txnId: userOpStatusAndId.transactionHash
            })
            setActiveStep('in-progress')
            if (userOpStatusAndId.transactionHash && finalUserOpHash)
              setUrlToTxnId(userOpStatusAndId.transactionHash, finalUserOpHash, network.id)
            break

          default:
            throw new Error('Unhandled user operation status. Please contact support')
        }
      })
      .catch(() => setUserOpStatusData({ status: 'not_found', txnId: null }))
  }, [
    isUserOp,
    userOpStatusData,
    network,
    finalUserOpHash,
    txnReceipt,
    setActiveStep,
    userOpHash,
    refetchUserOpStatusCounter
  ])

  useEffect(() => {
    if (!network || txn || (isUserOp && !userOpHash && !userOpStatusData.txnId)) return

    const finalTxnId = userOpStatusData.txnId ?? txnId
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
  }, [
    txnId,
    network,
    userOpStatusData,
    isUserOp,
    userOpHash,
    txn,
    refetchTxnCounter,
    setActiveStep
  ])

  useEffect(() => {
    if (!network || txnReceipt.blockNumber || (isUserOp && !userOpHash && !userOpStatusData.txnId))
      return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    const finalTxnId = userOpStatusData.txnId ?? txnId
    provider
      .getTransactionReceipt(finalTxnId)
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
        if (!finalUserOpHash && txn) {
          try {
            const handleOpsData = handleOpsInterface.decodeFunctionData('handleOps', txn.data)
            userOpsLength = handleOpsData[0].length
          } catch (e: any) {
            /* silence is bitcoin */
          }
        }

        const userOpLog = parseLogs(receipt.logs, finalUserOpHash ?? '', userOpsLength)
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
    network,
    txnReceipt,
    txn,
    refetchReceiptCounter,
    setActiveStep,
    userOpHash,
    finalUserOpHash,
    isUserOp,
    userOpStatusData.txnId
  ])

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

  // calculate pending time
  useEffect(() => {
    if (!network || !txn || txnReceipt.blockNumber) return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
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
  }, [txn, txnReceipt, network])

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

  // if it's an user op,
  // we need to call the entry point to fetch the hashes
  // and find the matching hash
  // only after pass to reproduce calls
  useEffect(() => {
    if (!finalUserOpHash || !network || !txn || userOp) return

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

      if (finalHash.toLowerCase() === finalUserOpHash.toLowerCase()) {
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
  }, [network, txn, finalUserOpHash, userOp])

  useEffect(() => {
    if (isUserOp && !userOp) return
    if (calls) return

    if (network && txnReceipt.from && txn) {
      setCost(ethers.formatEther(txnReceipt.actualGasCost!.toString()))
      const accountOp = {
        accountAddr: txnReceipt.from!,
        networkId: network.id,
        signingKeyAddr: txnReceipt.from!, // irrelevant
        signingKeyType: 'internal', // irrelevant
        nonce: BigInt(0), // irrelevant
        calls: reproduceCalls(txn, userOp),
        gasLimit: Number(txn.gasLimit),
        signature: '0x', // irrelevant
        gasFeePayment: null,
        accountOpToExecuteBefore: null,
        humanizerMeta: humanizerJSON
      }
      callsHumanizer(
        accountOp,
        standardOptions.storage,
        standardOptions.fetch,
        (humanizedCalls) => standardOptions.parser(humanizedCalls, setCalls),
        standardOptions.emitError
      ).catch((e) => {
        if (!calls) setCalls([])
        return e
      })
    }
  }, [network, txnReceipt, txn, isUserOp, standardOptions, userOp, calls])

  return {
    nativePrice,
    blockData,
    finalizedStatus,
    cost,
    calls,
    pendingTime,
    userOpStatusData
  }
}

export default useSteps
