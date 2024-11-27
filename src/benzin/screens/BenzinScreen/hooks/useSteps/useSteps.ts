import {
  AbiCoder,
  Block,
  formatEther,
  getAddress,
  isAddress,
  JsonRpcProvider,
  keccak256,
  TransactionReceipt,
  TransactionResponse
} from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { ERC_4337_ENTRYPOINT } from '@ambire-common/consts/deploy'
import { Fetch } from '@ambire-common/interfaces/fetch'
import { Network } from '@ambire-common/interfaces/network'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import {
  AccountOpIdentifiedBy,
  fetchTxnId,
  isIdentifiedByTxn
} from '@ambire-common/libs/accountOp/submittedAccountOp'
import { humanizeAccountOp } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
import {
  handleOps060,
  handleOps070
} from '@benzin/screens/BenzinScreen/constants/humanizerInterfaces'
import { ActiveStepType, FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { UserOperation } from '@benzin/screens/BenzinScreen/interfaces/userOperation'

import { getBenzinUrlParams } from '../../utils/url'
import { parseLogs } from './utils/parseLogs'
import { decodeUserOp, entryPointTxnSplit, reproduceCallsFromTxn } from './utils/reproduceCalls'

const REFETCH_TIME = 4000 // 4 seconds

interface Props {
  txnId: string | null
  userOpHash: string | null
  relayerId: string | null
  network: Network | null
  standardOptions: {
    fetch: Fetch
    callRelayer: any
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
  txnId: string | null
  from: string | null
  originatedFrom: string | null
  userOp: UserOperation | null
}

// if the transaction hash is found, we make the top url the real txn id
// because user operation hashes are not reliable long term
const setUrlToTxnId = (
  transactionHash: string,
  userOpHash: string | null,
  relayerId: string | null,
  chainId: bigint
) => {
  const splitUrl = (window.location.href || '').split('?')
  const search = splitUrl[1]
  const searchParams = new URLSearchParams(search)
  const isInternal = typeof searchParams.get('isInternal') === 'string'

  const getIdentifiedBy = (): AccountOpIdentifiedBy => {
    if (relayerId) return { type: 'Relayer', identifier: relayerId }
    if (userOpHash) return { type: 'UserOperation', identifier: userOpHash }
    return { type: 'Transaction', identifier: transactionHash }
  }

  window.history.pushState(
    null,
    '',
    `${splitUrl[0]}${getBenzinUrlParams({
      chainId,
      txnId: transactionHash,
      identifiedBy: getIdentifiedBy(),
      isInternal
    })}`
  )
}

const parseHumanizer = (humanizedCalls: IrCall[]): IrCall[] => {
  // remove deadlines from humanizer
  const finalParsedCalls = humanizedCalls.map((call) => {
    const localCall: IrCall = { ...call }
    localCall.fullVisualization = call.fullVisualization?.filter(
      (visual) => visual.type !== 'deadline' && !visual.isHidden
    )
    localCall.warnings = call.warnings?.filter((warn) => warn.content !== 'Unknown address')
    return localCall
  })
  return finalParsedCalls
}

const useSteps = ({
  txnId,
  userOpHash,
  relayerId,
  network,
  standardOptions,
  setActiveStep,
  provider
}: Props): StepsData => {
  const [nativePrice, setNativePrice] = useState<number>(0)
  const [txn, setTxn] = useState<null | TransactionResponse>(null)
  const [txnReceipt, setTxnReceipt] = useState<{
    actualGasCost: null | BigInt
    originatedFrom: null | string
    blockNumber: null | BigInt
  }>({ actualGasCost: null, originatedFrom: null, blockNumber: null })
  const [blockData, setBlockData] = useState<null | Block>(null)
  const [finalizedStatus, setFinalizedStatus] = useState<FinalizedStatusType>({
    status: 'fetching'
  })
  const [refetchTxnIdCounter, setRefetchTxnIdCounter] = useState<number>(0)
  const [refetchTxnCounter, setRefetchTxnCounter] = useState<number>(0)
  const [refetchReceiptCounter, setRefetchReceiptCounter] = useState<number>(0)
  const [cost, setCost] = useState<null | string>(null)
  const [pendingTime, setPendingTime] = useState<number>(30)
  const [userOp, setUserOp] = useState<null | UserOperation>(null)
  const [foundTxnId, setFoundTxnId] = useState<null | string>(txnId)

  const identifiedBy: AccountOpIdentifiedBy = useMemo(() => {
    if (relayerId) return { type: 'Relayer', identifier: relayerId }
    if (userOpHash) return { type: 'UserOperation', identifier: userOpHash }
    return { type: 'Transaction', identifier: txnId as string }
  }, [relayerId, userOpHash, txnId])

  const receiptAlreadyFetched = useMemo(() => !!txnReceipt.blockNumber, [txnReceipt.blockNumber])

  useEffect(() => {
    let timeout: any

    if (!network || (!userOpHash && !relayerId) || txn || receiptAlreadyFetched) return

    fetchTxnId(identifiedBy, network, standardOptions.fetch, standardOptions.callRelayer)
      .then((result) => {
        if (result.status === 'rejected') {
          setFinalizedStatus({
            status: 'rejected',
            reason: 'Bundler has rejected the user operation'
          })
          setActiveStep('finalized')
          return
        }

        if (result.status === 'not_found') {
          timeout = setTimeout(() => {
            setRefetchTxnIdCounter(refetchTxnIdCounter + 1)
          }, REFETCH_TIME)
          return
        }

        const resultTxnId = result.txnId as string
        if (resultTxnId !== foundTxnId) {
          setFoundTxnId(resultTxnId)
          setActiveStep('in-progress')
          setUrlToTxnId(resultTxnId, userOpHash, relayerId, network.chainId)
        }

        // if there's no txn and receipt, keep searching
        if (!txn && !receiptAlreadyFetched) {
          timeout = setTimeout(() => {
            setRefetchTxnIdCounter(refetchTxnIdCounter + 1)
          }, REFETCH_TIME)
        }
      })
      .catch((e) => e)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [
    network,
    identifiedBy,
    standardOptions.fetch,
    standardOptions.callRelayer,
    txnId,
    setActiveStep,
    refetchTxnIdCounter,
    foundTxnId,
    relayerId,
    userOpHash,
    txn,
    receiptAlreadyFetched
  ])

  // find the transaction
  useEffect(() => {
    let timeout: any

    if (txn || !foundTxnId || !provider) return

    provider
      .getTransaction(foundTxnId)
      .then((fetchedTxn: null | TransactionResponse) => {
        if (!fetchedTxn) {
          // if is EOA broadcast and we can't fetch the txn 15 times,
          // declare the txn dropped
          if (isIdentifiedByTxn(identifiedBy) && refetchTxnCounter >= 15) {
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            return
          }

          // start a refetch
          timeout = setTimeout(() => {
            setRefetchTxnCounter(refetchTxnCounter + 1)
          }, REFETCH_TIME)
          return
        }

        setTxn(fetchedTxn)
      })
      .catch(() => null)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [foundTxnId, txn, refetchTxnCounter, setActiveStep, provider, identifiedBy])

  useEffect(() => {
    let timeout: any
    if (receiptAlreadyFetched || !foundTxnId || !provider) return

    provider
      .getTransactionReceipt(foundTxnId)
      .then((receipt: null | TransactionReceipt) => {
        if (!receipt) {
          // if there is a txn but no receipt, it means it is pending
          if (txn) {
            timeout = setTimeout(
              () => setRefetchReceiptCounter(refetchReceiptCounter + 1),
              REFETCH_TIME
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

        // if the txn is still not fetched at this moment, do not proceed
        // as it will set incorrect data for sender (from)
        if (!txn) return

        setTxnReceipt({
          originatedFrom: receipt.from,
          actualGasCost: receipt.gasUsed * receipt.gasPrice,
          blockNumber: BigInt(receipt.blockNumber)
        })

        let userOpsLength = 0
        if (!userOpHash && txn) {
          try {
            // check the sighash
            const sigHash = txn.data.slice(0, 10)
            const handleOpsData =
              sigHash === handleOps060.getFunction('handleOps')!.selector
                ? handleOps060.decodeFunctionData('handleOps', txn.data)
                : handleOps070.decodeFunctionData('handleOps', txn.data)
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

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [
    foundTxnId,
    receiptAlreadyFetched,
    txn,
    refetchReceiptCounter,
    setActiveStep,
    userOpHash,
    provider,
    txnId,
    userOp
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
    if (!txn || receiptAlreadyFetched || !provider || !network) return

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
  }, [txn, receiptAlreadyFetched, provider, network])

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

    getNativePrice(network, fetch as any)
      .then((fetchedPrice) => setNativePrice(parseFloat(fetchedPrice.toFixed(2))))
      .catch(() => setNativePrice(0))
  }, [network])

  // if it's an user op,
  // we need to call the entry point to fetch the hashes
  // and find the matching hash
  // only after pass to reproduce calls
  useEffect(() => {
    if (!userOpHash || !network || !txn || userOp) return

    const sigHash = txn.data.slice(0, 10)
    const is060 = sigHash === handleOps060.getFunction('handleOps')!.selector
    let handleOpsData = null
    try {
      handleOpsData = is060
        ? handleOps060.decodeFunctionData('handleOps', txn.data)
        : handleOps070.decodeFunctionData('handleOps', txn.data)
    } catch (e) {
      console.log('this txn is an userOp but does not call handleOps')
      setUserOp({
        sender: '',
        callData: '',
        hashStatus: 'not_found'
      })
    }

    if (!handleOpsData) return

    const userOperations = handleOpsData[0]
    const abiCoder = new AbiCoder()

    let hashFound = false
    userOperations.forEach((opArray: any) => {
      const sender = opArray[0]
      const nonce = opArray[1]
      const hashInitCode = keccak256(opArray[2])
      const hashCallData = keccak256(opArray[3])

      let hash
      let paymasterAndData
      if (!is060) {
        const accountGasLimits = opArray[4]
        const preVerificationGas = opArray[5]
        const gasFees = opArray[6]
        paymasterAndData = opArray[7]
        const hashPaymasterAndData = keccak256(paymasterAndData)
        const packed = abiCoder.encode(
          ['address', 'uint256', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'bytes32'],
          [
            sender,
            nonce,
            hashInitCode,
            hashCallData,
            accountGasLimits,
            preVerificationGas,
            gasFees,
            hashPaymasterAndData
          ]
        )
        hash = keccak256(packed)
      } else {
        const callGasLimit = opArray[4]
        const verificationGasLimit = opArray[5]
        const preVerificationGas = opArray[6]
        const maxFeePerGas = opArray[7]
        const maxPriorityFeePerGas = opArray[8]
        paymasterAndData = opArray[9]
        const hashPaymasterAndData = keccak256(paymasterAndData)

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

        hash = keccak256(packed)
      }
      const finalHash = keccak256(
        abiCoder.encode(
          ['bytes32', 'address', 'uint256'],
          [
            hash,
            is060 ? '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' : ERC_4337_ENTRYPOINT,
            network.chainId
          ]
        )
      )
      const paymaster = isAddress(paymasterAndData.slice(0, 42))
        ? getAddress(paymasterAndData.slice(0, 42))
        : ''

      if (finalHash.toLowerCase() === userOpHash.toLowerCase()) {
        hashFound = true
        setUserOp({
          sender,
          callData: opArray[3],
          hashStatus: 'found',
          paymaster
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

  const calls: IrCall[] | null = useMemo(() => {
    if (userOpHash && userOp?.hashStatus !== 'found') return null
    if (!network) return null
    if (txnReceipt.actualGasCost) setCost(formatEther(txnReceipt.actualGasCost!.toString()))
    if (userOp?.hashStatus !== 'found' && txn && txnId && entryPointTxnSplit[txn.data.slice(0, 10)])
      return entryPointTxnSplit[txn.data.slice(0, 10)](txn, network, txnId)

    if (txnReceipt.originatedFrom && txn) {
      const accountOp: AccountOp = {
        accountAddr: userOp?.sender || txnReceipt.originatedFrom!,
        networkId: network.id,
        signingKeyAddr: txnReceipt.originatedFrom!, // irrelevant
        signingKeyType: 'internal', // irrelevant
        nonce: BigInt(0), // irrelevant
        calls: userOp ? decodeUserOp(userOp) : reproduceCallsFromTxn(txn),
        gasLimit: Number(txn.gasLimit),
        signature: '0x', // irrelevant
        gasFeePayment: null,
        accountOpToExecuteBefore: null
      }
      const humanizedCalls = humanizeAccountOp(accountOp, { network })
      return parseHumanizer(humanizedCalls)
    }
    return null
  }, [network, txnReceipt, txn, userOpHash, userOp, txnId])
  return {
    nativePrice,
    blockData,
    finalizedStatus,
    cost,
    calls,
    pendingTime,
    txnId: foundTxnId,
    from: userOp?.sender || null,
    originatedFrom: txnReceipt.originatedFrom,
    userOp
  }
}

export default useSteps
