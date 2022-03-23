// @ts-nocheck

import { constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import { names, tokens } from '@modules/common/constants/humanizerInfo.json'

const knownAliases = {}
// address (lowercase) => [symbol, decimals]
const knownTokens = {}

export const formatNativeTokenAddress = (address) =>
  address.toLowerCase() === `0x${'e'.repeat(40)}` ? `0x${'0'.repeat(40)}` : address.toLowerCase()

// Currently takes network because one day we may be seeing the same addresses used on different networks
export function getName(addr) {
  const address = addr.toLowerCase()
  if (knownAliases[address]) return knownAliases[address]
  return names[address] || (tokens[address] ? `${tokens[address][0]} token` : null) || addr
}

export function token(addr, amount, extended = false) {
  const address = addr.toLowerCase()
  const assetInfo = tokens[address] || knownTokens[address]
  if (assetInfo) {
    const extendedToken = {
      address,
      symbol: assetInfo[0],
      decimals: assetInfo[1],
      amount: null
    }

    if (!amount) return !extended ? assetInfo[0] : extendedToken

    if (constants.MaxUint256.eq(amount))
      return !extended
        ? `maximum ${assetInfo[0]}`
        : {
            ...extendedToken,
            amount: -1
          }

    return !extended
      ? `${formatUnits(amount, assetInfo[1])} ${assetInfo[0]}`
      : {
          ...extendedToken,
          amount: formatUnits(amount, assetInfo[1])
        }
  }
  return !extended
    ? `${formatUnits(amount, 0)} units of unknown token`
    : {
        address,
        symbol: null,
        decimals: null,
        amount: formatUnits(amount, 0)
      }
}

export function nativeToken(network, amount, extended = false) {
  const extendedNativeToken = {
    address: `0x${'0'.repeat(40)}`,
    symbol: 'unknown native token',
    decimals: 18
  }

  // All EVM chains use a 18 decimal native asset
  if (network) {
    return !extended
      ? `${formatUnits(amount, 18)} ${network.nativeAssetSymbol}`
      : {
          ...extendedNativeToken,
          symbol: network.nativeAssetSymbol,
          amount: formatUnits(amount, 18)
        }
  }
  return !extended
    ? `${formatUnits(amount, 18)} unknown native token`
    : {
        ...extendedNativeToken,
        amount: formatUnits(amount, 18)
      }
}

export function setKnownAddresses(addrs) {
  addrs.forEach(({ address, name }) => (knownAliases[address.toLowerCase()] = name))
}

export function setKnownTokens(tokens) {
  tokens.forEach(
    ({ address, symbol, decimals }) => (knownTokens[address.toLowerCase()] = [symbol, decimals])
  )
}

export function isKnown(txn, from) {
  if (txn[0] === from) return true
  const address = txn[0].toLowerCase()
  return !!(knownAliases[address] || names[address] || tokens[address] || knownTokens[address])
}

export { knownAliases, knownTokens }
