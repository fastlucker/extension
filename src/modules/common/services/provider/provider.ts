import { providers } from 'ethers'

import networks from '@modules/common/constants/networks'

export function getProvider(networkId: string | number) {
  const network = networks.find(({ id }) => id === networkId)
  if (!network) throw new Error(`getProvider called with non-existent network: ${networkId}`)
  const { id: name, chainId } = network
  const url = network.rpc
  if (url.startsWith('wss:')) return new providers.WebSocketProvider(url, { name, chainId })
  return new providers.StaticJsonRpcProvider(url, { name, chainId })
}
