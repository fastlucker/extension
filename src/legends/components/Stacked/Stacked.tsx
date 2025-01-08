import React from 'react'

import ArbitrumLogo from '@legends/components/NetworkIcons/ArbitrumLogo'
import BaseLogo from '@legends/components/NetworkIcons/BaseLogo'
import EthereumLogo from '@legends/components/NetworkIcons/EthereumLogo'
import OptimismLogo from '@legends/components/NetworkIcons/OptimismLogo'
import ScrollLogo from '@legends/components/NetworkIcons/ScrollLogo'
import { Networks } from '@legends/modules/legends/types'

import styles from './Stacked.module.scss'

interface StackedProps {
  chains: Networks[]
}

const NETWORK_ICONS: { [key in Networks]: React.ReactNode } = {
  ethereum: <EthereumLogo />,
  base: <BaseLogo />,
  arbitrum: <ArbitrumLogo />,
  optimism: <OptimismLogo />,
  scroll: <ScrollLogo />
}

const Stacked: React.FC<StackedProps> = ({ chains }) => (
  <div className={styles.itemNetworks}>
    {chains.map((chain) => (
      <React.Fragment key={chain}>{NETWORK_ICONS[chain]}</React.Fragment>
    ))}
  </div>
)

export default Stacked
