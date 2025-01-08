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

export { getDoesNetworkMatch }
