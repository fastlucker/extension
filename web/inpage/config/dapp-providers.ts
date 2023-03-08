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
  },
  'www.myetherwallet.com': {
    [NETWORKS.ethereum]: 'wss://nodes.mewapi.io/ws/eth',
    [NETWORKS.polygon]: 'wss://nodes.mewapi.io/ws/matic',
    [NETWORKS['binance-smart-chain']]: 'wss://nodes.mewapi.io/ws/bsc',
    [NETWORKS.moonbeam]: 'wss://wss.api.moonbeam.network',
    [NETWORKS.moonriver]: 'wss://wss.api.moonriver.moonbeam.network'
  },
  'pancakeswap.finance': {
    [NETWORKS.ethereum]: 'https://eth-mainnet.nodereal.io/v1/13acdadd769d4128b5c4a994e42140b3',
    [NETWORKS['binance-smart-chain']]: 'https://nodes.pancakeswap.info/'
  }
}
