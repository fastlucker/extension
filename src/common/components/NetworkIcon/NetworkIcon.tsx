import React from 'react'
import { View, ViewStyle } from 'react-native'

import AndromedaLogo from '@common/assets/svg/AndromedaLogo'
import AndromedaMonochromeIcon from '@common/assets/svg/AndromedaMonochromeIcon'
import ArbitrumLogo from '@common/assets/svg/ArbitrumLogo'
import ArbitrumMonochromeIcon from '@common/assets/svg/ArbitrumMonochromeIcon'
import AvalancheLogo from '@common/assets/svg/AvalancheLogo'
import AvalancheMonochromeIcon from '@common/assets/svg/AvalancheMonochromeIcon'
import BinanceLogo from '@common/assets/svg/BinanceLogo'
import BinanceMonochromeIcon from '@common/assets/svg/BinanceMonochromeIcon'
import EthereumLogo from '@common/assets/svg/EthereumLogo'
import EthereumMonochromeIcon from '@common/assets/svg/EthereumMonochromeIcon'
import FantomLogo from '@common/assets/svg/FantomLogo'
import FantomMonochromeIcon from '@common/assets/svg/FantomMonochromeIcon'
import GasTankIcon from '@common/assets/svg/GasTankIcon'
import GnosisLogo from '@common/assets/svg/GnosisLogo'
import GnosisMonochromeIcon from '@common/assets/svg/GnosisMonochromeIcon'
import KCCKuCoinLogo from '@common/assets/svg/KCCKuCoinLogo'
import KCCKuCoinMonochromeIcon from '@common/assets/svg/KCCKuCoinMonochromeIcon'
import MoonbeamLogo from '@common/assets/svg/MoonbeamLogo'
import MoonbeamMonochromeIcon from '@common/assets/svg/MoonbeamMonochromeIcon'
import MoonriverLogo from '@common/assets/svg/MoonriverLogo'
import MoonriverMonochromeIcon from '@common/assets/svg/MoonriverMonochromeIcon'
import OptimismLogo from '@common/assets/svg/OptimismLogo'
import OptimismMonochromeIcon from '@common/assets/svg/OptimismMonochromeIcon'
import PolygonLogo from '@common/assets/svg/PolygonLogo'
import PolygonMonochromeIcon from '@common/assets/svg/PolygonMonochromeIcon'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
import Text from '@common/components/Text'
import { NETWORKS } from '@common/constants/networks'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import styles from './styles'

export type NetworkIconNameType = keyof typeof NETWORKS | 'gasTank' | 'rewards'

type Props = {
  name: NetworkIconNameType
  size?: number
  type?: 'regular' | 'monochrome'
  style?: ViewStyle
  [key: string]: any
}

const icons: { [key: string]: any } = {
  [NETWORKS.ethereum]: EthereumLogo,
  [NETWORKS.rinkeby]: EthereumLogo,
  [NETWORKS.polygon]: PolygonLogo,
  [NETWORKS.avalanche]: AvalancheLogo,
  [NETWORKS['binance-smart-chain']]: BinanceLogo,
  [NETWORKS.fantom]: FantomLogo,
  [NETWORKS.moonbeam]: MoonbeamLogo,
  [NETWORKS.moonriver]: MoonriverLogo,
  [NETWORKS.arbitrum]: ArbitrumLogo,
  [NETWORKS.optimism]: OptimismLogo,
  [NETWORKS.gnosis]: GnosisLogo,
  [NETWORKS.kucoin]: KCCKuCoinLogo,
  [NETWORKS.andromeda]: AndromedaLogo,
  gasTank: GasTankIcon,
  rewards: RewardsIcon
}

const iconsMonochrome: { [key: string]: any } = {
  [NETWORKS.ethereum]: EthereumMonochromeIcon,
  [NETWORKS.rinkeby]: EthereumMonochromeIcon,
  [NETWORKS.polygon]: PolygonMonochromeIcon,
  [NETWORKS.avalanche]: AvalancheMonochromeIcon,
  [NETWORKS['binance-smart-chain']]: BinanceMonochromeIcon,
  [NETWORKS.fantom]: FantomMonochromeIcon,
  [NETWORKS.moonbeam]: MoonbeamMonochromeIcon,
  [NETWORKS.moonriver]: MoonriverMonochromeIcon,
  [NETWORKS.arbitrum]: ArbitrumMonochromeIcon,
  [NETWORKS.optimism]: OptimismMonochromeIcon,
  [NETWORKS.gnosis]: GnosisMonochromeIcon,
  [NETWORKS.kucoin]: KCCKuCoinMonochromeIcon,
  [NETWORKS.andromeda]: AndromedaMonochromeIcon
}

const NetworkIcon = ({ name, size = 32, type = 'regular', style = {}, ...rest }: Props) => {
  const Icon = type === 'monochrome' ? iconsMonochrome[name] : icons[name]
  const { theme } = useTheme()
  return Icon ? (
    <Icon width={size} height={size} style={[styles.icon, style]} {...rest} />
  ) : (
    <View
      style={[
        { width: size, height: size, borderRadius: 50, overflow: 'hidden' },
        flexbox.alignCenter,
        flexbox.justifyCenter,
        style
      ]}
    >
      <View
        style={[
          { width: size * 0.5625, height: size * 0.5625, backgroundColor: theme.primary },
          flexbox.alignCenter,
          flexbox.justifyCenter,
          styles.icon
        ]}
      >
        <Text weight="medium" fontSize={size * 0.425} color="#fff">
          {name[0].toUpperCase()}
        </Text>
      </View>
    </View>
  )
}

export default React.memo(NetworkIcon)
