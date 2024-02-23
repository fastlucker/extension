import { AbiCoder, Log } from 'ethers'

interface UserOperationEventData {
  nonce: Number
  success: boolean
}

export const parseLogs = (
  logs: readonly Log[],
  userOpHash: string
): UserOperationEventData | null => {
  let userOpLog = null

  logs.forEach((log: Log) => {
    try {
      if (log.topics.length === 4 && log.topics[1].toLowerCase() === userOpHash.toLowerCase()) {
        // decode data for UserOperationEvent:
        // 'event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)'
        const coder = new AbiCoder()
        userOpLog = coder.decode(['uint256', 'bool', 'uint256', 'uint256'], log.data)
      }
    } catch (e: any) {
      /* silence is bitcoin */
    }
  })

  if (!userOpLog) return null

  return {
    nonce: userOpLog[0],
    success: userOpLog[1]
  }
}
