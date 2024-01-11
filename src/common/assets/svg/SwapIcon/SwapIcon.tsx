import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const SwapIcon: React.FC<Props> = ({
  width = 30,
  height = 30,
  color = colors.martinique,
  strokeWidth = '1.5'
}) => (
  <Svg width={width} height={height} viewBox="0 0 16 16">
    <G fill="none">
      <Path d="M16 0v16H0V0z" />
      <G stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <Path d="M2.147 8.167v-1.2a1.378 1.378 0 0 1 1.518-1.5h6.982L7.272 2.095" />
        <Path d="M13.663 8.125v1.2a1.378 1.378 0 0 1-1.518 1.5H5.17l3.37 3.372" />
      </G>
    </G>
  </Svg>
)

export default SwapIcon
