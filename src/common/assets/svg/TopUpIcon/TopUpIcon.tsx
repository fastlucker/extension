import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const TopUpIcon: React.FC<Props> = ({ width = 27, height = 27, color = colors.martinique }) => (
  <Svg width={width} height={height}>
    <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M9.362 15.962a2.489 2.489 0 0 0 2.43 2.546h2.735a2.166 2.166 0 0 0 2.11-2.226 1.922 1.922 0 0 0-1.44-2.11l-4.379-1.528a1.912 1.912 0 0 1-1.44-2.11 2.176 2.176 0 0 1 2.11-2.226h2.735a2.489 2.489 0 0 1 2.43 2.546" />
      <Path d="M12.999 6.867v13.095" />
      <Path d="M25 13.414a12 12 0 1 1-12-12" />
      <Path d="M19 2.614v4.8h4.8" />
      <Path d="m25 1.414-6 6" />
    </G>
  </Svg>
)

export default TopUpIcon
