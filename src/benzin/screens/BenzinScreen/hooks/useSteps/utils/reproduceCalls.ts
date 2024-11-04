import { getAddress, isAddress, TransactionReceipt, TransactionResponse, ZeroAddress } from 'ethers'

import { RELAYER_EXECUTOR_ADDRESSES } from '@ambire-common/consts/addresses'
import { AMBIRE_PAYMASTER } from '@ambire-common/consts/deploy'
import {
  deployAndExecuteInterface,
  deployAndExecuteMultipleInterface,
  executeBatchInterface,
  executeBySenderInterface,
  executeCallInterface,
  executeInterface,
  executeMultipleInterface,
  executeUnknownWalletInterface,
  handleOps070,
  handleOpsInterface,
  quickAccManagerCancelInterface,
  quickAccManagerExecScheduledInterface,
  quickAccManagerSendInterface
} from '@benzin/screens/BenzinScreen/constants/humanizerInterfaces'
import { UserOperation } from '@benzin/screens/BenzinScreen/interfaces/userOperation'

export const userOpSigHashes = {
  executeBySender: executeBySenderInterface.getFunction('executeBySender')!.selector,
  execute: executeInterface.getFunction('execute')!.selector,
  executeMultiple: executeMultipleInterface.getFunction('executeMultiple')!.selector,
  executeCall: executeCallInterface.getFunction('execute')!.selector,
  executeBatch: executeBatchInterface.getFunction('executeBatch')!.selector
}

const transformToAccOpCall = (call: any) => {
  return {
    to: call[0],
    value: BigInt(call[1]),
    data: call[2]
  }
}

const getExecuteCalls = (callData: string) => {
  const data = executeInterface.decodeFunctionData('execute', callData)
  return data[0].map((call: any) => transformToAccOpCall(call))
}

const getExecuteBySenderCalls = (callData: string) => {
  const data = executeBySenderInterface.decodeFunctionData('executeBySender', callData)
  return data[0].map((call: any) => transformToAccOpCall(call))
}

const getExecuteMultipleCalls = (callData: string) => {
  const data = executeMultipleInterface.decodeFunctionData('executeMultiple', callData)
  const calls = data[0].map((executeArgs: any) => executeArgs[0]).flat()
  return calls.map((call: any) => transformToAccOpCall(call))
}

const getExecuteCallCalls = (callData: string) => {
  const data = executeCallInterface.decodeFunctionData('execute', callData)
  return [transformToAccOpCall(data)]
}

const getExecuteUnknownWalletCalls = (callData: string) => {
  const data = executeUnknownWalletInterface.decodeFunctionData('execute', callData)
  return [transformToAccOpCall(data)]
}

const getExecuteBatchCalls = (callData: string) => {
  const batch = executeBatchInterface.decodeFunctionData('executeBatch', callData)
  const calls = []
  for (let i = 0; i < batch[0].length; i++) {
    const to = batch[0][i]
    const data = batch[1][i]
    calls.push(transformToAccOpCall([to, 0n, data]))
  }
  return calls
}

const decodeUserOp = (userOp: UserOperation) => {
  const { callData, paymaster } = userOp
  if (!callData) return null
  const callDataSigHash = callData.slice(0, 10)
  const matcher = {
    [userOpSigHashes.executeBySender]: getExecuteBySenderCalls,
    [userOpSigHashes.execute]: getExecuteCalls,
    [userOpSigHashes.executeMultiple]: getExecuteMultipleCalls,
    [userOpSigHashes.executeCall]: getExecuteCallCalls,
    [executeUnknownWalletInterface.getFunction('execute')!.selector]: getExecuteUnknownWalletCalls,
    [userOpSigHashes.executeBatch]: getExecuteBatchCalls
  }
  let decodedCalls
  if (matcher[callDataSigHash]) decodedCalls = matcher[callDataSigHash](callData)

  if (isAddress(paymaster) && getAddress(paymaster) === AMBIRE_PAYMASTER)
    decodedCalls = decodedCalls.slice(0, -1)
  return decodedCalls
}

const reproduceCalls = (txn: TransactionResponse, userOp: UserOperation | null) => {
  if (userOp && userOp.hashStatus === 'found') {
    const decoded = decodeUserOp(userOp)
    if (decoded) return decoded
  }

  const sigHash = txn.data.slice(0, 10)

  let parsedCalls = [transformToAccOpCall([txn.to ? txn.to : ZeroAddress, txn.value, txn.data])]

  if (sigHash === executeInterface.getFunction('execute')!.selector) {
    parsedCalls = getExecuteCalls(txn.data)
  }

  if (sigHash === executeBySenderInterface.getFunction('executeBySender')!.selector) {
    parsedCalls = getExecuteBySenderCalls(txn.data)
  }

  if (sigHash === executeMultipleInterface.getFunction('executeMultiple')!.selector) {
    parsedCalls = getExecuteMultipleCalls(txn.data)
  }

  if (sigHash === deployAndExecuteInterface.getFunction('deployAndExecute')!.selector) {
    const data = deployAndExecuteInterface.decodeFunctionData('deployAndExecute', txn.data)
    parsedCalls = data[2].map((call: any) => transformToAccOpCall(call))
  }

  if (
    sigHash === deployAndExecuteMultipleInterface.getFunction('deployAndExecuteMultiple')!.selector
  ) {
    const data = deployAndExecuteMultipleInterface.decodeFunctionData(
      'deployAndExecuteMultiple',
      txn.data
    )
    const calls: any = data[2].map((executeArgs: any) => executeArgs[0]).flat()
    parsedCalls = calls.map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerSendInterface.getFunction('send')!.selector) {
    const data = quickAccManagerSendInterface.decodeFunctionData('send', txn.data)
    parsedCalls = data[3].map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerCancelInterface.getFunction('cancel')!.selector) {
    const data = quickAccManagerCancelInterface.decodeFunctionData('cancel', txn.data)
    parsedCalls = data[4].map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerExecScheduledInterface.getFunction('execScheduled')!.selector) {
    const data = quickAccManagerExecScheduledInterface.decodeFunctionData('execScheduled', txn.data)
    return data[3].map((call: any) => transformToAccOpCall(call))
  }

  // @non-ambire executeBatch
  if (sigHash === executeBatchInterface.getFunction('executeBatch')!.selector) {
    parsedCalls = getExecuteBatchCalls(txn.data)
  }
  if (RELAYER_EXECUTOR_ADDRESSES.includes(txn.from)) parsedCalls = parsedCalls.slice(0, -1)
  return parsedCalls
}

export const getSender = (receipt: TransactionReceipt, txn: TransactionResponse) => {
  const sigHash = txn.data.slice(0, 10)

  if (sigHash === handleOpsInterface.getFunction('handleOps')!.selector) {
    const handleOpsData = handleOpsInterface.decodeFunctionData('handleOps', txn.data)
    const sigHashValues = Object.values(userOpSigHashes)
    const userOps = handleOpsData[0].filter((op: any) => sigHashValues.includes(op[3].slice(0, 10)))
    if (userOps.length) {
      return userOps[0][0]
    }
  }

  if (sigHash === handleOps070.getFunction('handleOps')!.selector) {
    const handleOpsData = handleOps070.decodeFunctionData('handleOps', txn.data)
    const sigHashValues = Object.values(userOpSigHashes)
    const userOps = handleOpsData[0].filter((op: any) => sigHashValues.includes(op[3].slice(0, 10)))
    if (userOps.length) {
      return userOps[0][0]
    }
  }

  if (Object.values(userOpSigHashes).includes(sigHash)) return receipt.to

  return receipt.from
}

export default reproduceCalls
