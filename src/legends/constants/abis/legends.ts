/**
 * Actually, there is no Legends contract. Instead, the relayer watches for transactions
 * to the contract address and checks the signature of the transaction.
 */
const LEGENDS_CONTRACT_ABI = [
  'function link(address v2, address v1OrEoa, bytes signature)',
  'function linkAndAcceptInvite(address inviteeV2, address inviteeEoaOrV1, address inviterV2, bytes signature)',
  'function invite(address invitee)',
  'function spinWheel(uint256)'
]

export { LEGENDS_CONTRACT_ABI }
