import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const SwapIcon: React.FC<SvgProps> = ({
  width = 26,
  height = 26,
  color = colors.martinique,
  strokeWidth = '1.5',
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 26 26" {...rest}>
    <G fill="none">
      <Path d="M26 0v26H0V0z" />
      <G stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <Path d="M4.453 13.944v-1.715a2 2 0 0 1 2.253-2.15h10.355l-5.002-4.814" />
        <Path d="M21.539 12.055c0 .195.007 1.3 0 1.716a2 2 0 0 1-2.253 2.15H8.939l5 4.813" />
      </G>
    </G>
  </Svg>
)

export default React.memo(SwapIcon)
