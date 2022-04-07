import React from 'react'

import AvalancheMonochromeIcon from '@assets/svg/AvalancheMonochromeIcon'
import BinanceMonochromeIcon from '@assets/svg/BinanceMonochromeIcon'
import EthereumLogo from '@assets/svg/EthereumLogo'
import EthereumMonochromeIcon from '@assets/svg/EthereumMonochromeIcon'
import PolygonLogo from '@assets/svg/PolygonLogo'
import PolygonMonochromeIcon from '@assets/svg/PolygonMonochromeIcon'
import AvalancheLogo from '@modules/common/assets/svg/networks/AvalancheLogo'
import BinanceSmartChainLogo from '@modules/common/assets/svg/networks/BinanceSmartChainLogo'

export type NetworkType = {
  id: string
  chainId: number
  rpc: string
  nativeAssetSymbol: string
  name: string
  Icon: React.FC
  IconMonochrome: React.FC
  explorerUrl: string
}

const networks: NetworkType[] = [
  {
    id: 'ethereum',
    chainId: 1,
    rpc: 'https://mainnet.infura.io/v3/3d22938fd7dd41b7af4197752f83e8a1',
    nativeAssetSymbol: 'ETH',
    name: 'Ethereum',
    Icon: EthereumLogo,
    IconMonochrome: EthereumMonochromeIcon,
    explorerUrl: 'https://etherscan.io'
  },
  {
    id: 'polygon',
    chainId: 137,
    rpc: 'https://polygon-rpc.com/rpc',
    nativeAssetSymbol: 'MATIC',
    name: 'Polygon',
    Icon: PolygonLogo,
    IconMonochrome: PolygonMonochromeIcon,
    explorerUrl: 'https://polygonscan.com'
  },
  {
    id: 'avalanche',
    chainId: 43114,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    nativeAssetSymbol: 'AVAX',
    name: 'Avalanche',
    Icon: AvalancheLogo,
    IconMonochrome: AvalancheMonochromeIcon,
    explorerUrl: 'https://snowtrace.io'
  },
  {
    // to match the zapper ID
    id: 'binance-smart-chain',
    chainId: 56,
    rpc: 'https://bsc-dataseed.binance.org/',
    nativeAssetSymbol: 'BNB',
    name: 'Binance',
    Icon: BinanceSmartChainLogo,
    IconMonochrome: BinanceMonochromeIcon,
    explorerUrl: 'https://bscscan.com'
  } /* , {
  id: 'arbitrum',
  chainId: 42161,
  rpc: 'https://arb1.arbitrum.io/rpc',
  nativeAssetSymbol: 'AETH',
  name: 'Arbitrum',
  icon: '/resources/networks/arbitrum.svg',
  explorerUrl: 'https://arbiscan.io'
} */
]

export default networks
