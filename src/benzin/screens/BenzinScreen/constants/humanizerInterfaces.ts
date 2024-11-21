import { Interface } from 'ethers'

const executeInterface = new Interface([
  'function execute(tuple(address, uint256, bytes)[] calldata calls, bytes calldata signature) public payable'
])
const executeMultipleInterface = new Interface([
  'function executeMultiple(tuple(tuple(address, uint256, bytes)[] calls, bytes signature)[] calldata toExec) external payable'
])
const transferInterface = new Interface([
  'function transfer(address recipient, uint256 amount) external returns (bool)'
])
const deployAndExecuteInterface = new Interface([
  'function deployAndExecute(bytes calldata code, uint256 salt, tuple(address, uint256, bytes)[] calldata txns, bytes calldata signature) external returns (address)'
])

const deployAndExecuteMultipleInterface = new Interface([
  'function deployAndExecuteMultiple(bytes calldata code, uint256 salt, tuple(tuple(address, uint256, bytes)[] calls, bytes signature)[] calldata toExec) external returns (address)'
])

const handleOps060 = new Interface([
  'function handleOps(tuple(address, uint256, bytes, bytes, uint256, uint256, uint256, uint256, uint256, bytes, bytes)[] calldata ops, address payable beneficiary) public'
])

const handleOps070 = new Interface([
  'function handleOps(tuple(address, uint256, bytes, bytes, bytes32, uint256, bytes32, bytes, bytes)[] calldata ops, address payable beneficiary) public'
])

const executeBySenderInterface = new Interface([
  'function executeBySender(tuple(address, uint256, bytes)[] calls) external payable'
])

const quickAccManagerSendInterface = new Interface([
  'function send(address identity, tuple(uint, address, address) calldata acc, tuple(bool, bytes, bytes) calldata sigs, tuple(address, uint256, bytes)[] calldata txns) external'
])

const quickAccManagerCancelInterface = new Interface([
  'function cancel(address identity, tuple(uint, address, address) calldata acc, uint nonce, bytes calldata sig, tuple(address, uint256, bytes)[] calldata txns) external'
])

const quickAccManagerExecScheduledInterface = new Interface([
  'function execScheduled(address identity, bytes32 accHash, uint nonce, tuple(address, uint256, bytes)[] calldata txns) external'
])

// unknown wallet for now
const executeCallInterface = new Interface([
  'function execute(address to, uint256 value, bytes calldata data, uint8 operation)'
])

// unknown wallet for now
const executeBatchInterface = new Interface(['function executeBatch(address[] apps, bytes[] data)'])

// unknown wallet for now
const executeUnknownWalletInterface = new Interface([
  'function execute(address, uint256, bytes)',
  'function executeBatch((address,uint256,bytes)[])'
])

export {
  executeInterface,
  executeMultipleInterface,
  transferInterface,
  deployAndExecuteInterface,
  deployAndExecuteMultipleInterface,
  executeBySenderInterface,
  quickAccManagerSendInterface,
  quickAccManagerCancelInterface,
  quickAccManagerExecScheduledInterface,
  executeCallInterface,
  executeBatchInterface,
  executeUnknownWalletInterface,
  handleOps060,
  handleOps070
}
