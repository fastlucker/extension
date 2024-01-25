import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const InfoIcon: React.FC<SvgProps> = ({
  width = 24,
  height = 24,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" {...rest}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Zm0-14v5"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.995 16h.009"
    />
  </Svg>
)

export default InfoIcon
