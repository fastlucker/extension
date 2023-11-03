import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BridgeIcon: React.FC<Props> = ({ width = 30, height = 30, color = colors.martinique }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16">
    <G fill="none">
      <Path d="M0 16V0h16v16z" />
      <G stroke={color} strokeLinecap="round" strokeWidth="1.5">
        <Path d="M6.798 14.064V6.388L3.43 9.758" />
        <Path d="M9.456 1.558v7.676l3.368-3.37" />
      </G>
    </G>
  </Svg>
)

export default BridgeIcon
