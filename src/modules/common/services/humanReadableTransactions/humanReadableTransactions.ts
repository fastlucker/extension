import { constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import { names, tokens } from '@modules/common/constants/humanizerInfo.json'

// address (lwoercase) => name
const knownAliases: any = {}
// address (lowercase) => [symbol, decimals]
const knownTokens: any = {}

export const formatNativeTokenAddress = (address: any) =>
  address.toLowerCase() === `0x${'e'.repeat(40)}` ? `0x${'0'.repeat(40)}` : address.toLowerCase()

// Currently takes network because one day we may be seeing the same addresses used on different networks
export function getName(addr: any, network: any) {
  const address = addr.toLowerCase()
  if (knownAliases[address]) return knownAliases[address]
  return names[address] || (tokens[address] ? `${tokens[address][0]} token` : null) || addr
}

export function token(addr?: any, amount?: any) {
  const address = addr.toLowerCase()
  const assetInfo = tokens[address] || knownTokens[address]
  if (assetInfo) {
    if (!amount) return assetInfo[0]
    if (constants.MaxUint256.eq(amount)) return `maximum ${assetInfo[0]}`
    return `${formatUnits(amount, assetInfo[1])} ${assetInfo[0]}`
  }
  return `${formatUnits(amount, 0)} units of unknown token`
}

export function nativeToken(network: any, amount: any) {
  // All EVM chains use a 18 decimal native asset
  if (network) {
    return `${formatUnits(amount, 18)} ${network.nativeAssetSymbol}`
  }
  return `${formatUnits(amount, 18)} unknown native token`
}

export function setKnownAddresses(addrs: any) {
  // eslint-disable-next-line no-return-assign
  addrs.forEach(({ address, name }: any) => (knownAliases[address.toLowerCase()] = name))
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export function setKnownTokens(tokens: any) {
  tokens.forEach(
    // eslint-disable-next-line no-return-assign
    ({ address, symbol, decimals }: any) =>
      (knownTokens[address.toLowerCase()] = [symbol, decimals])
  )
}

export function isKnown(txn: any, from: any) {
  if (txn[0] === from) return true
  const address = txn[0].toLowerCase()
  return !!(knownAliases[address] || names[address] || tokens[address] || knownTokens[address])
}

export { knownAliases, knownTokens }

// @TODO
// export function getMethodName(txn)
