import { Network } from '@ambire-common/interfaces/network'

const networkSort = (a: Network, b: Network, networks: Network[]) => {
  // Sorts the networks in the order they are added.
  // In the future we might allow the user to sort them or sort them by some other criteria.
  const aIndex = networks.findIndex((n) => n.id === a.id)
  const bIndex = networks.findIndex((n) => n.id === b.id)

  return aIndex - bIndex
}

export { networkSort }
