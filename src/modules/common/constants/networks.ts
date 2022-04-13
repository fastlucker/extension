import React from 'react'

import AvalancheLogo from '@assets/svg/AvalancheLogo'
import AvalancheMonochromeIcon from '@assets/svg/AvalancheMonochromeIcon'
import BinanceLogo from '@assets/svg/BinanceLogo'
import BinanceMonochromeIcon from '@assets/svg/BinanceMonochromeIcon'
import EthereumLogo from '@assets/svg/EthereumLogo'
import EthereumMonochromeIcon from '@assets/svg/EthereumMonochromeIcon'
import FantomLogo from '@assets/svg/FantomLogo'
import MoonbeamLogo from '@assets/svg/MoonbeamLogo'
import MoonriverLogo from '@assets/svg/MoonriverLogo'
import PolygonLogo from '@assets/svg/PolygonLogo'
import PolygonMonochromeIcon from '@assets/svg/PolygonMonochromeIcon'

export type NetworkType = {
  id: string
  chainId: number
  rpc: string
  nativeAssetSymbol: string
  name: string
  Icon: React.FC
  IconMonochrome: React.FC
  explorerUrl: string
  unstoppableDomainsChain: string
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
    explorerUrl: 'https://etherscan.io',
    unstoppableDomainsChain: 'ERC20'
  },
  {
    id: 'polygon',
    chainId: 137,
    rpc: 'https://polygon-rpc.com/rpc',
    nativeAssetSymbol: 'MATIC',
    name: 'Polygon',
    Icon: PolygonLogo,
    IconMonochrome: PolygonMonochromeIcon,
    explorerUrl: 'https://polygonscan.com',
    unstoppableDomainsChain: 'MATIC'
  },
  {
    id: 'avalanche',
    chainId: 43114,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    nativeAssetSymbol: 'AVAX',
    name: 'Avalanche',
    Icon: AvalancheLogo,
    IconMonochrome: AvalancheMonochromeIcon,
    explorerUrl: 'https://snowtrace.io',
    unstoppableDomainsChain: 'ERC20'
  },
  {
    // to match the zapper ID
    id: 'binance-smart-chain',
    chainId: 56,
    rpc: 'https://bsc-dataseed.binance.org/',
    nativeAssetSymbol: 'BNB',
    name: 'Binance',
    Icon: BinanceLogo,
    IconMonochrome: BinanceMonochromeIcon,
    explorerUrl: 'https://bscscan.com',
    unstoppableDomainsChain: 'BEP20'
  },
  {
    id: 'fantom',
    chainId: 250,
    rpc: 'https://rpc.ftm.tools',
    nativeAssetSymbol: 'FTM',
    name: 'Fantom Opera',
    Icon: FantomLogo,
    IconMonochrome: FantomLogo,
    explorerUrl: 'https://ftmscan.com',
    unstoppableDomainsChain: 'ERC20'
  },
  {
    id: 'moonbeam',
    chainId: 1284,
    rpc: 'https://rpc.api.moonbeam.network',
    nativeAssetSymbol: 'GLMR',
    name: 'Moonbeam',
    Icon: MoonbeamLogo,
    IconMonochrome: MoonbeamLogo,
    explorerUrl: 'https://moonscan.io/',
    unstoppableDomainsChain: 'ERC20'
  },
  {
    id: 'moonriver',
    chainId: 1285,
    rpc: 'https://rpc.api.moonriver.moonbeam.network',
    nativeAssetSymbol: 'MOVR',
    name: 'Moonriver',
    Icon: MoonriverLogo,
    IconMonochrome: MoonriverLogo,
    explorerUrl: 'https://moonriver.moonscan.io/',
    unstoppableDomainsChain: 'ERC20'
  } /* , {
		id: 'arbitrum',
		chainId: 42161,
		rpc: 'https://arb1.arbitrum.io/rpc',
		nativeAssetSymbol: 'AETH',
		name: 'Arbitrum',
		icon: '/resources/networks/arbitrum.svg',
		explorerUrl: 'https://arbiscan.io',
		unstoppableDomainsChain: 'ERC20
} */
]

export default networks
