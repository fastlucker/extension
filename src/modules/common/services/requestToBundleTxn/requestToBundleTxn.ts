import IdentityFactoryABI from 'adex-protocol-eth/abi/IdentityFactory'
import accountPresets from 'ambire-common/src/constants/accountPresets'
import { Interface } from 'ethers/lib/utils'

const IdentityFactory = new Interface(IdentityFactoryABI)

export function toBundleTxn({ to, value, data }: any, from: any) {
  // Transactions with no `to` are interpreted by the Ethereum network as CREATE (contract deployment) if they come from an EOA
  // however, our accounts are not EOAs, so we will just call the factory with a user-specific nonce, that's also identifiable (0x6942)
  if (to === '0x' || !to) {
    const salt = `0x69420000000000${Date.now().toString(16).slice(1, 9)}00${from.slice(2)}`
    return [
      accountPresets.identityFactoryAddr,
      value,
      IdentityFactory.encodeFunctionData('deploy', [data, salt])
    ]
  }
  return [to, value || '0x0', data || '0x']
}
