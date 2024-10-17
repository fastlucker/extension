import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const WithdrawIcon: React.FC<Props> = ({
  width = 30,
  height = 30,
  color = colors.martinique,
  strokeWidth = '1.5'
}) => (
  <Svg width={width} height={height} viewBox="0 0 16 16">
    <G fill="none">
      <G stroke={color} strokeWidth={strokeWidth}>
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.148 11.989 1.855 2.013 1.856-2.012"
        />
        <Path strokeLinecap="round" d="M8.003 9.005v4.996" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M3.785 9.989H2V2h12v7.989h-1.772" />
        <Path d="M2.013 5.508h11.981" />
      </G>
      <Path d="M0 16V0h16v16z" />
    </G>
  </Svg>
)

export default WithdrawIcon
