import { ethers, TransactionResponse } from 'ethers'

import {
  deployAndExecuteInterface,
  deployAndExecuteMultipleInterface,
  executeBySenderInterface,
  executeInterface,
  executeMultipleInterface,
  handleOpsInterface,
  quickAccManagerCancelInterface,
  quickAccManagerExecScheduledInterface,
  quickAccManagerSendInterface,
  transferInterface
} from '@benzin/screens/BenzinScreen/constants/humanizerInterfaces'

const feeCollector = '0x942f9CE5D9a33a82F88D233AEb3292E680230348'

const filterFeeCollectorCalls = (callsLength: number, callArray: any): boolean => {
  // if calls are exactly one, it means no fee collector calls
  if (callsLength === 1) return true
  if (
    callArray[2].slice(0, 10) === transferInterface.getFunction('transfer')!.selector &&
    transferInterface.decodeFunctionData('transfer', callArray[2])[0] === feeCollector
  ) {
    return false
  }
  if (callArray[0] === feeCollector) return false

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
    .filter((call: any) => filterFeeCollectorCalls(data[0].length, call))
    .map((call: any) => transformToAccOpCall(call))
}

const getExecuteBySenderCalls = (callData: string) => {
  const data = executeBySenderInterface.decodeFunctionData('executeBySender', callData)
  return data[0]
    .filter((call: any) => filterFeeCollectorCalls(data[0].length, call))
    .map((call: any) => transformToAccOpCall(call))
}

const getExecuteMultipleCalls = (callData: string) => {
  const data = executeMultipleInterface.decodeFunctionData('executeMultiple', callData)
  const calls = data[0].map((executeArgs: any) => executeArgs[0]).flat()
  return calls
    .filter((call: any) => filterFeeCollectorCalls(calls.length, call))
    .map((call: any) => transformToAccOpCall(call))
}

const decodeUserOp = (txnData: string, sigHash: string, sender: string, isUserOp: boolean) => {
  const handleOpsData = handleOpsInterface.decodeFunctionData('handleOps', txnData)
  const sigHashes = {
    executeBySender: executeBySenderInterface.getFunction('executeBySender')!.selector,
    execute: executeInterface.getFunction('execute')!.selector,
    executeMultiple: executeMultipleInterface.getFunction('executeMultiple')!.selector
  }
  const sigHashValues = Object.values(sigHashes)
  const userOps = isUserOp
    ? handleOpsData[0].filter((op: any) => op[0] === sender)
    : handleOpsData[0].filter((op: any) => sigHashValues.includes(op[3].slice(0, 10)))
  if (!userOps.length) return null

  const callData = userOps[0][3]
  const callDataSigHash = callData.slice(0, 10)

  if (callDataSigHash === sigHashes.executeBySender) {
    return getExecuteBySenderCalls(callData)
  }

  if (sigHash === sigHashes.execute) {
    return getExecuteCalls(callData)
  }

  if (sigHash === sigHashes.executeMultiple) {
    return getExecuteMultipleCalls(callData)
  }
}

const reproduceCalls = (txn: TransactionResponse, sender: string, isUserOp: boolean) => {
  const sigHash = txn.data.slice(0, 10)

  console.log('THE SIGHASH')
  console.log(sigHash)

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
      .filter((call: any) => filterFeeCollectorCalls(data[2].length, call))
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
      .filter((call: any) => filterFeeCollectorCalls(calls.length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  // user op
  if (sigHash === handleOpsInterface.getFunction('handleOps')!.selector) {
    const decodedUserOp = decodeUserOp(txn.data, sigHash, sender, isUserOp)
    if (decodedUserOp) return decodedUserOp
  }

  // v1
  console.log('Send sighash')
  console.log(quickAccManagerSendInterface.getFunction('send')!.selector)
  if (sigHash === quickAccManagerSendInterface.getFunction('send')!.selector) {
    const data = quickAccManagerSendInterface.decodeFunctionData('send', txn.data)
    return data[3]
      .filter((call: any) => filterFeeCollectorCalls(data[3].length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerCancelInterface.getFunction('cancel')!.selector) {
    const data = quickAccManagerCancelInterface.decodeFunctionData('cancel', txn.data)
    return data[4]
      .filter((call: any) => filterFeeCollectorCalls(data[4].length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  // v1
  if (sigHash === quickAccManagerExecScheduledInterface.getFunction('execScheduled')!.selector) {
    const data = quickAccManagerExecScheduledInterface.decodeFunctionData('execScheduled', txn.data)
    return data[3]
      .filter((call: any) => filterFeeCollectorCalls(data[3].length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  return [transformToAccOpCall([txn.to ? txn.to : ethers.ZeroAddress, txn.value, txn.data])]
}

export default reproduceCalls
