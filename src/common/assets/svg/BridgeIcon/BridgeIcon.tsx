import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const BridgeIcon: React.FC<SvgProps> = ({
  width = 26,
  height = 26,
  color = colors.martinique,
  strokeWidth = '1.5',
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 26 26" {...rest}>
    <G fill="none">
      <Path d="M0 26V0h26v26z" />
      <G stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <Path d="M10.887 20.966v-12.2l-5.352 5.357" />
        <Path d="M15.112 5.033v12.2l5.352-5.357" />
      </G>
    </G>
  </Svg>
)

export default BridgeIcon
