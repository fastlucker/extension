import { ethers } from 'ethers'

const executeInterface = new ethers.Interface([
  'function execute(tuple(address, uint256, bytes)[] calldata calls, bytes calldata signature) public payable'
])
const executeMultipleInterface = new ethers.Interface([
  'function executeMultiple(tuple(tuple(address, uint256, bytes)[] calls, bytes signature)[] calldata toExec) external payable'
])
const transferInterface = new ethers.Interface([
  'function transfer(address recipient, uint256 amount) external returns (bool)'
])
const deployAndExecuteInterface = new ethers.Interface([
  'function deployAndExecute(bytes calldata code, uint256 salt, tuple(address, uint256, bytes)[] calldata txns, bytes calldata signature) external returns (address)'
])

const deployAndExecuteMultipleInterface = new ethers.Interface([
  'function deployAndExecuteMultiple(bytes calldata code, uint256 salt, tuple(tuple(address, uint256, bytes)[] calls, bytes signature)[] calldata toExec) external returns (address)'
])

const handleOpsInterface = new ethers.Interface([
  'function handleOps(tuple(address, uint256, bytes, bytes, uint256, uint256, uint256, uint256, uint256, bytes, bytes)[] calldata ops, address payable beneficiary) public'
])

const executeBySenderInterface = new ethers.Interface([
  'function executeBySender(tuple(address, uint256, bytes)[] calls) external payable'
])

const quickAccManagerSendInterface = new ethers.Interface([
  'function send(address identity, tuple(uint, address, address) calldata acc, tuple(bool, bytes, bytes) calldata sigs, tuple(address, uint256, bytes)[] calldata txns) external'
])

export {
  executeInterface,
  executeMultipleInterface,
  transferInterface,
  deployAndExecuteInterface,
  deployAndExecuteMultipleInterface,
  handleOpsInterface,
  executeBySenderInterface,
  quickAccManagerSendInterface
}
