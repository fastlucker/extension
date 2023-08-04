import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EarnIcon: React.FC<Props> = ({ width = 13, height = 22, color = colors.martinique }) => (
  <Svg width={width} height={height}>
    <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M1 14.495a3.561 3.561 0 0 0 3.476 3.643h3.913a3.1 3.1 0 0 0 3.018-3.185 2.75 2.75 0 0 0-2.061-3.018L3.081 9.749A2.735 2.735 0 0 1 1.02 6.731a3.113 3.113 0 0 1 3.018-3.185h3.913a3.561 3.561 0 0 1 3.476 3.643" />
      <Path d="M6.203 1v19.946" />
    </G>
  </Svg>
)

export default EarnIcon
