import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'

const getDoesNetworkMatch = ({
  networks,
  itemNetworkId,
  tokenFlags,
  lowercaseSearch
}: {
  networks: Network[]
  itemNetworkId: string
  tokenFlags?: TokenResult['flags']
  lowercaseSearch: string
}) => {
  let isMatchingByFlag = false

  if (tokenFlags) {
    if ('gas tank'.includes(lowercaseSearch)) {
      isMatchingByFlag = !!tokenFlags.onGasTank
    } else if ('rewards'.includes(lowercaseSearch)) {
      isMatchingByFlag = !!tokenFlags.rewardsType
    }
  }

  const networkName = networks.find((n) => n.id === itemNetworkId)?.name || ''

  return networkName.toLowerCase().includes(lowercaseSearch) || isMatchingByFlag
}

const tokenSearch = ({
  search,
  token,
  networks
}: {
  search: string
  token: TokenResult
  networks: Network[]
}) => {
  if (!search) return true

  const lowercaseSearch = search.toLowerCase()

  const doesAddressMatch = token.address.toLowerCase().includes(lowercaseSearch)
  const doesSymbolMatch = token.symbol.toLowerCase().includes(lowercaseSearch)

  return (
    doesAddressMatch ||
    doesSymbolMatch ||
    getDoesNetworkMatch({
      networks,
      tokenFlags: token.flags,
      itemNetworkId: token.networkId,
      lowercaseSearch
    })
  )
}

export { getDoesNetworkMatch, tokenSearch }
