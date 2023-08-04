import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const SwapIcon: React.FC<Props> = ({ width = 30, height = 30, color = colors.martinique }) => (
  <Svg width={width} height={height}>
    <G fill="none">
      <Path d="M30 0v30H0V0z" />
      <G stroke={color} strokeLinecap="round" strokeWidth="2">
        <Path d="M4.004 15.314c0-.254-.009-1.689 0-2.236a2.567 2.567 0 0 1 2.828-2.8h12.994l-6.278-6.273" />
        <Path d="M25.453 15.233c0 .254.009 1.689 0 2.236a2.567 2.567 0 0 1-2.828 2.8H9.631l6.278 6.273" />
      </G>
    </G>
  </Svg>
)

export default SwapIcon
