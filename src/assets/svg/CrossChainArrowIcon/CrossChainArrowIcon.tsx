import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const CrossChainArrowIcon: React.FC<Props> = ({ width = 24, height = 24, color }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <G transform="translate(0 24) rotate(-90)">
      <G transform="translate(4.706 20.306) rotate(-90)">
        <Path
          d="M8.385,8.049a.809.809,0,0,0,.572-1.381L3.913,1.624l3.62.005h0a.809.809,0,0,0,0-1.618L0,0,7.812,7.812A.807.807,0,0,0,8.385,8.049Z"
          transform="translate(0 6.501) rotate(-45)"
          fill={color || colors.titan}
        />
        <Path
          d="M.809,8.05A.809.809,0,0,1,.237,6.668L5.281,1.624l-3.621.005a.809.809,0,0,1,0-1.618L9.194,0,1.381,7.813A.807.807,0,0,1,.809,8.05Z"
          transform="translate(11.353 14.621) rotate(-135)"
          fill={color || colors.titan}
        />
      </G>
    </G>
  </Svg>
)

export default CrossChainArrowIcon
