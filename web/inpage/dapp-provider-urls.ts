import { NETWORKS } from 'ambire-common/src/constants/networks'

export const DAPP_PROVIDER_URLS: { [key: string]: { [key in NETWORKS]?: string } } = {
  'app.uniswap.org': {
    [NETWORKS.ethereum]: 'https://mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
    [NETWORKS.polygon]: 'https://polygon-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
    [NETWORKS.optimism]: 'https://optimism-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
    [NETWORKS.arbitrum]: 'https://arbitrum-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1'
  },
  'app.aave.com': {
    [NETWORKS.ethereum]: 'https://rpc.ankr.com/eth',
    [NETWORKS.arbitrum]: ' https://arb1.arbitrum.io/rpc',
    [NETWORKS.avalanche]:
      'https://avax-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca/ext/bc/C/rpc',
    [NETWORKS.fantom]: 'https://fantom-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca',
    [NETWORKS.optimism]:
      'https://optimism-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca',
    [NETWORKS.polygon]: 'https://poly-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca'
  }
}
