import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const PinIcon: React.FC<SvgProps> = ({
  width = 24,
  height = 24,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...rest}>
    <g fill="none">
      <Path d="M0 0h24v24H0z" />
      <G stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <Path d="M5.072 15.751a7.025 7.025 0 0 1 3.93-5.324V4.356a5.508 5.508 0 0 1-2.293-3.1h10.584a5.485 5.485 0 0 1-2.287 3.1v6.073a7.017 7.017 0 0 1 3.926 5.323Z" />
        <Path d="M12.002 15.749v7" />
      </G>
    </g>
  </Svg>
)

export default PinIcon
