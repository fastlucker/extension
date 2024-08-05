import { TransactionReceipt, TransactionResponse, ZeroAddress } from 'ethers'

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
  quickAccManagerSendInterface,
  transferInterface
} from '@benzin/screens/BenzinScreen/constants/humanizerInterfaces'
import { UserOperation } from '@benzin/screens/BenzinScreen/interfaces/userOperation'

export const userOpSigHashes = {
  executeBySender: executeBySenderInterface.getFunction('executeBySender')!.selector,
  execute: executeInterface.getFunction('execute')!.selector,
  executeMultiple: executeMultipleInterface.getFunction('executeMultiple')!.selector,
  executeCall: executeCallInterface.getFunction('execute')!.selector,
  executeBatch: executeBatchInterface.getFunction('executeBatch')!.selector
}

const feeCollector = '0x942f9CE5D9a33a82F88D233AEb3292E680230348'

const filterFeeCollectorCalls = (calls: any, callArray: any, index: number): boolean => {
  // if calls are exactly one, it means no fee collector calls
  const callsLength = calls.length
  if (callsLength === 1) return true

  // this is for the case where we do a native top up but have
  // transformed the native to wrapped. We shouldn't filter out
  if (
    index + 1 === callsLength && // the fee call
    calls[callsLength - 2][0].toLowerCase() === callArray[0].toLowerCase() && // the same address
    callArray[2].slice(0, 10) === transferInterface.getFunction('transfer')!.selector &&
    transferInterface.decodeFunctionData('transfer', callArray[2])[1] === calls[callsLength - 2][1]
  ) {
    return true
  }

  // a fee collector call is one that is at the end of the calls array
  if (
    index + 1 === callsLength &&
    callArray[2].slice(0, 10) === transferInterface.getFunction('transfer')!.selector &&
    transferInterface.decodeFunctionData('transfer', callArray[2])[0] === feeCollector
  ) {
    return false
  }
  if (index + 1 === callsLength && callArray[0] === feeCollector) return false

  return true
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
  return data[0]
    .filter((call: any, index: number) => filterFeeCollectorCalls(data[0], call, index))
    .map((call: any) => transformToAccOpCall(call))
}

const getExecuteBySenderCalls = (callData: string) => {
  const data = executeBySenderInterface.decodeFunctionData('executeBySender', callData)
  return data[0]
    .filter((call: any, index: number) => filterFeeCollectorCalls(data[0], call, index))
    .map((call: any) => transformToAccOpCall(call))
}

const getExecuteMultipleCalls = (callData: string) => {
  const data = executeMultipleInterface.decodeFunctionData('executeMultiple', callData)
  const calls = data[0].map((executeArgs: any) => executeArgs[0]).flat()
  return calls
    .filter((call: any, index: number) => filterFeeCollectorCalls(calls, call, index))
    .map((call: any) => transformToAccOpCall(call))
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
  const callData = userOp.callData
  const callDataSigHash = callData.slice(0, 10)

  if (callDataSigHash === userOpSigHashes.executeBySender) {
    return getExecuteBySenderCalls(callData)
  }

  if (callDataSigHash === userOpSigHashes.execute) {
    return getExecuteCalls(callData)
  }

  if (callDataSigHash === userOpSigHashes.executeMultiple) {
    return getExecuteMultipleCalls(callData)
  }

  if (callDataSigHash === userOpSigHashes.executeCall) {
    return getExecuteCallCalls(callData)
  }

  if (callDataSigHash === executeUnknownWalletInterface.getFunction('execute')!.selector) {
    return getExecuteUnknownWalletCalls(callData)
  }

  if (callDataSigHash === userOpSigHashes.executeBatch) {
    return getExecuteBatchCalls(callData)
  }
}

const decodeUserOpWithoutUserOpHash = (txnData: string, is070 = false) => {
  const handleOpsData = is070
    ? handleOps070.decodeFunctionData('handleOps', txnData)
    : handleOpsInterface.decodeFunctionData('handleOps', txnData)
  const sigHashValues = Object.values(userOpSigHashes)
  const userOps = handleOpsData[0].filter((op: any) => sigHashValues.includes(op[3].slice(0, 10)))
  // if there's more than 1 user op, we cannot guess which is the
  // correct one. We do not guess
  if (!userOps.length || userOps.length > 1) return null

  return decodeUserOp({
    sender: '',
    callData: userOps[0][3],
    hashStatus: 'not_found'
  })
}

const reproduceCalls = (txn: TransactionResponse, userOp: UserOperation | null) => {
  if (userOp && userOp.hashStatus === 'found') return decodeUserOp(userOp)

  const sigHash = txn.data.slice(0, 10)

  if (sigHash === executeInterface.getFunction('execute')!.selector) {
    return getExecuteCalls(txn.data)
  }

  if (sigHash === executeBySenderInterface.getFunction('executeBySender')!.selector) {
    return getExecuteBySenderCalls(txn.data)
  }

  if (sigHash === executeMultipleInterface.getFunction('executeMultiple')!.selector) {
    return getExecuteMultipleCalls(txn.data)
  }

  if (sigHash === deployAndExecuteInterface.getFunction('deployAndExecute')!.selector) {
    const data = deployAndExecuteInterface.decodeFunctionData('deployAndExecute', txn.data)
    return data[2]
      .filter((call: any, index: number) => filterFeeCollectorCalls(data[2], call, index))
      .map((call: any) => transformToAccOpCall(call))
  }

  if (
    sigHash === deployAndExecuteMultipleInterface.getFunction('deployAndExecuteMultiple')!.selector
  ) {
    const data = deployAndExecuteMultipleInterface.decodeFunctionData(
      'deployAndExecuteMultiple',
      txn.data
    )
    const calls: any = data[2].map((executeArgs: any) => executeArgs[0]).flat()
    return calls
      .filter((call: any, index: number) => filterFeeCollectorCalls(calls, call, index))
      .map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerSendInterface.getFunction('send')!.selector) {
    const data = quickAccManagerSendInterface.decodeFunctionData('send', txn.data)
    return data[3]
      .filter((call: any, index: number) => filterFeeCollectorCalls(data[3], call, index))
      .map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerCancelInterface.getFunction('cancel')!.selector) {
    const data = quickAccManagerCancelInterface.decodeFunctionData('cancel', txn.data)
    return data[4]
      .filter((call: any, index: number) => filterFeeCollectorCalls(data[4], call, index))
      .map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerExecScheduledInterface.getFunction('execScheduled')!.selector) {
    const data = quickAccManagerExecScheduledInterface.decodeFunctionData('execScheduled', txn.data)
    return data[3]
      .filter((call: any, index: number) => filterFeeCollectorCalls(data[3], call, index))
      .map((call: any) => transformToAccOpCall(call))
  }

  if (sigHash === handleOpsInterface.getFunction('handleOps')!.selector) {
    const decodedUserOp = decodeUserOpWithoutUserOpHash(txn.data)
    if (decodedUserOp) return decodedUserOp
  }

  if (sigHash === handleOps070.getFunction('handleOps')!.selector) {
    const decodedUserOp = decodeUserOpWithoutUserOpHash(txn.data, true)
    if (decodedUserOp) return decodedUserOp
  }

  // @non-ambire executeBatch
  if (sigHash === executeBatchInterface.getFunction('executeBatch')!.selector) {
    return getExecuteBatchCalls(txn.data)
  }

  return [transformToAccOpCall([txn.to ? txn.to : ZeroAddress, txn.value, txn.data])]
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
