/**
 * Actually, there is no Legends contract. Instead, the relayer watches for transactions
 * to the contract address and checks the signature of the transaction.
 */
const LEGENDS_CONTRACT_ADDRESS = '0x1415926535897932384626433832795028841971'

// new rewards nft address
// @TODO redeploy the contract because the address will change
const REWARDS_NFT_ADDRESS = '0x65f73C761F531281C884948bEC90618246DA6d7b'

export { LEGENDS_CONTRACT_ADDRESS, REWARDS_NFT_ADDRESS }
