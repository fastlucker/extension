import { NETWORKS } from '@common/constants/networks'

export const DAPP_PROVIDER_URLS: { [key: string]: { [key in NETWORKS]?: string } } = {
  'app.uniswap.org': {
    [NETWORKS.ethereum]: 'https://mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
    [NETWORKS.polygon]: 'https://polygon-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
    [NETWORKS.optimism]: 'https://optimism-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
    [NETWORKS.arbitrum]: 'https://arbitrum-mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1'
  },
  'app.aave.com': {
    [NETWORKS.ethereum]: 'https://eth-mainnet.rpc.grove.city/v1/62b3314e123e6f00397f19ca',
    [NETWORKS.arbitrum]: 'https://arbitrum-one.rpc.grove.city/v1/62b3314e123e6f00397f19ca',
    [NETWORKS.avalanche]: 'https://avax-mainnet.rpc.grove.city/v1/62b3314e123e6f00397f19ca',
    [NETWORKS.fantom]: 'https://fantom-mainnet.rpc.grove.city/v1/62b3314e123e6f00397f19ca',
    [NETWORKS.optimism]: 'https://optimism-mainnet.rpc.grove.city/v1/62b3314e123e6f00397f19ca',
    [NETWORKS.polygon]: 'https://poly-mainnet.rpc.grove.city/v1/62b3314e123e6f00397f19ca'
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
    [NETWORKS['binance-smart-chain']]: 'https://nodes.pancakeswap.info'
  },
  // TODO: Figure out why these don't work. 1inch uses wss://app.1inch.io:19006,
  // but wss is not working too as well
  // 'app.1inch.io': {
  //   [NETWORKS.ethereum]: 'https://web3-node.1inch.io',
  //   [NETWORKS.polygon]: 'https://bor-nodes.1inch.io',
  //   [NETWORKS['binance-smart-chain']]: 'https://bsc-nodes.1inch.io',
  //   [NETWORKS.optimism]: 'https://optimism-nodes.1inch.io',
  //   [NETWORKS.arbitrum]: 'https://arbitrum-nodes.1inch.io',
  //   [NETWORKS.gnosis]: 'https://gnosis-nodes.1inch.io',
  //   [NETWORKS.avalanche]: 'https://avalanche-nodes.1inch.io',
  //   [NETWORKS.fantom]: 'https://fantom-nodes.1inch.io'
  // }
  'app.gmx.io': {
    [NETWORKS.avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc'
  },
  'stargate.finance': {
    [NETWORKS.ethereum]: 'https://eth-mainnet.public.blastapi.io',
    [NETWORKS['binance-smart-chain']]: 'https://bsc-dataseed4.binance.org',
    [NETWORKS.avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [NETWORKS.polygon]: 'https://polygon-rpc.com',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [NETWORKS.optimism]: 'https://endpoints.omniatech.io/v1/op/mainnet/public',
    [NETWORKS.fantom]: 'https://rpc.ftm.tools'
  },
  'apeswap.finance': {
    [NETWORKS.polygon]: 'https://polygon-rpc.com',
    [NETWORKS['binance-smart-chain']]: 'https://bsc-dataseed.binance.org',
    [NETWORKS.ethereum]: 'https://rpc.ankr.com/eth',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc'
  },
  'www.bungee.exchange': {
    [NETWORKS.ethereum]: 'https://cloudflare-eth.com',
    [NETWORKS.polygon]: 'https://polygon-rpc.com',
    [NETWORKS.avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [NETWORKS['binance-smart-chain']]: 'https://rpc.ankr.com/bsc',
    [NETWORKS.fantom]: 'https://rpc.ankr.com/fantom',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [NETWORKS.gnosis]: 'https://rpc.gnosischain.com',
    [NETWORKS.optimism]: 'https://mainnet.optimism.io'
  },
  'traderjoexyz.com': {
    [NETWORKS.avalanche]: 'https://avax-mainnet.rpc.grove.city/v1/efa3a1ca',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [NETWORKS['binance-smart-chain']]: 'https://bsc-mainnet.rpc.grove.city/v1/efa3a1ca',
    [NETWORKS.ethereum]: 'https://eth-mainnet.rpc.grove.city/v1/efa3a1ca'
  },
  'app.sushi.com': {
    [NETWORKS.ethereum]: 'https://api.sushirelay.com/v1',
    [NETWORKS.polygon]: 'https://polygon-rpc.com/',
    [NETWORKS.avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [NETWORKS['binance-smart-chain']]: 'https://bsc-dataseed.binance.org',
    [NETWORKS.fantom]: 'https://rpcapi.fantom.network',
    [NETWORKS.moonbeam]: 'https://rpc.api.moonbeam.network',
    [NETWORKS.moonriver]: 'https://rpc.moonriver.moonbeam.network',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [NETWORKS.gnosis]: 'https://rpc.gnosischain.com',
    [NETWORKS.optimism]: 'https://mainnet.optimism.io',
    [NETWORKS.andromeda]: 'https://andromeda.metis.io/?owner=1088'
  },
  'app.pooltogether.com': {
    [NETWORKS.ethereum]:
      'https://ethereum-mainnet-web3-provider-proxy.pooltogether-api.workers.dev',
    [NETWORKS.polygon]: 'https://polygon-mainnet.infura.io/v3/1d6cb6d8f137423ab26111c61c0760ef',
    [NETWORKS.avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [NETWORKS.optimism]: 'https://optimism-mainnet-web3-provider-proxy.pooltogether-api.workers.dev'
  },
  'stake.lido.fi': {
    [NETWORKS.ethereum]: 'https://stake.lido.fi/api/rpc?chainId=1'
  },
  // Note: Returns 500 for `eth_chainId`, `net_version` and other rpc methods
  // 'polygon.lido.fi': {
  //   [NETWORKS.ethereum]: 'https://polygon.lido.fi/api/rpc?chainId=1'
  // }
  'swap.cow.fi': {
    [NETWORKS.ethereum]: 'https://eth-mainnet.nodereal.io/v1/ed3c6720eb3f470e9ceac8f8f12e8b14',
    [NETWORKS.gnosis]: 'https://rpc.gnosis.gateway.fm'
  },
  'app.hop.exchange': {
    [NETWORKS.ethereum]: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
    [NETWORKS.polygon]: 'https://polygon-rpc.com',
    [NETWORKS.gnosis]: 'https://rpc.gnosis.gateway.fm',
    [NETWORKS.optimism]: 'https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc'
  },
  'sudoswap.xyz': {
    [NETWORKS.ethereum]: 'https://eth-mainnet.g.alchemy.com/v2/PJG1MyfrI9qb_JdOJJVSa5stBo5O7uyU'
  },
  'app.paraswap.io': {
    [NETWORKS.ethereum]: 'https://eth.llamarpc.com',
    [NETWORKS.polygon]: 'https://polygon-rpc.com',
    [NETWORKS.avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [NETWORKS.arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [NETWORKS.fantom]: 'https://rpcapi.fantom.network',
    [NETWORKS.optimism]: 'https://mainnet.optimism.io',
    [NETWORKS['binance-smart-chain']]: 'https://bsc-dataseed1.defibit.io'
  },
  'app.balancer.fi': {
    [NETWORKS.ethereum]: 'https://mainnet.infura.io/v3/daaa68ec242643719749dd1caba2fc66',
    [NETWORKS.polygon]: 'https://polygon-mainnet.infura.io/v3/daaa68ec242643719749dd1caba2fc66',
    [NETWORKS.arbitrum]: 'https://arb-mainnet.g.alchemy.com/v2/VBeQgTCRqqPtuuEPsFzRdwKXzDyN6aFh',
    [NETWORKS.gnosis]: 'https://rpc.gnosischain.com'
  }
}
