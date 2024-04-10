import { JsonRpcProvider, WebSocketProvider } from 'ethers'

import { networks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'

// @ts-ignore
const rpcProviders: { [key in NetworkDescriptor['id']]: any } = {}

const setProvider = (_id: NetworkDescriptor['id']) => {
  // eslint-disable-next-line no-underscore-dangle
  const network = networks.find(({ id }) => id === _id)
  const url = network?.rpcUrls[0]
  if (!network) return null

  if (url?.startsWith('wss:')) {
    return new WebSocketProvider(url)
  }

  return new JsonRpcProvider(url)
}

if (!Object.keys(rpcProviders).length) {
  networks.forEach((network: NetworkDescriptor) => {
    rpcProviders[network.id] = setProvider(network.id)
  })
}

export { rpcProviders }
